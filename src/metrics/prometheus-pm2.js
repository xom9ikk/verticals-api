const prom = require('prom-client');
const pm2 = require('pm2');

const pm2exec = (cmd, ...args) => new Promise((resolve, reject) => {
  pm2[cmd](...args, (err, resp) => (err ? reject(err) : resolve(resp)));
});

const requestNeighboursData = (instancesData) => {
  const targetInstanceId = Number(process.env.pm_id);
  const data = { topic: 'get_prom_register', data: { targetInstanceId } };
  const promisesList = Object.values(instancesData).reduce((acc, instance) => {
    if (instance.pm_id !== targetInstanceId) {
      acc.push(pm2exec('sendDataToProcessId', instance.pm_id, data));
    }
    return acc;
  }, []);

  return Promise.all(promisesList);
};

const getAggregatedRegistry = (instancesData) => {
  const registryPromise = new Promise(async (resolve, reject) => {
    const instanceId = Number(process.env.pm_id);
    const instancesCount = instancesData.length;
    const registersPerInstance = [];
    let registersReady = 1;

    registersPerInstance[instanceId] = prom.register.getMetricsAsJSON();

    try {
      const bus = await pm2exec('launchBus');

      bus.on(`process:${instanceId}`, (packet) => {
        registersPerInstance[packet.data.instanceId] = packet.data.register;
        registersReady += 1;

        if (registersReady === instancesCount) {
          resolve(prom.AggregatorRegistry.aggregate(registersPerInstance));
        }
      });
    } catch (e) {
      reject(e);
    }
  });
  requestNeighboursData(instancesData);
  return registryPromise;
};

process.on('message', (packet) => {
  if (packet.topic === 'get_prom_register') {
    process.send({
      type: `process:${packet.data.targetInstanceId}`,
      data: {
        instanceId: Number(process.env.pm_id),
        register: prom.register.getMetricsAsJSON(),
        success: true,
      },
    });
  }
});

module.exports = async (req, res) => {
  let responseData;
  try {
    await pm2exec('connect', false);
    const instancesData = await pm2exec('list');
    if (instancesData.length === 1) { // 1 instance
      responseData = prom.register.metrics();
    } else {
      const register = await getAggregatedRegistry(instancesData);
      responseData = register.metrics();
    }
  } catch (err) {
    console.error(err);
  } finally {
    res.header('Content-Type', prom.register.contentType);
    res.send(responseData);
    pm2.disconnect();
  }
};
