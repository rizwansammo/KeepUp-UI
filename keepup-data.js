/* KeepUp — centralized data layer for the MateServer prototype.
   REFERENCE = verified read-only inspection, 17 Oct 2026.
   SIM_* = representative values used only in Demo mode; always labelled "Simulated" in the UI. */
(function () {
  var D = {};
  D.snapshot = { date: '2026-10-17', source: 'Authorized read-only inspection (Desktop Commander)' };

  D.server = {
    name: 'MateServer', provider: 'Contabo', ipv4: '169.58.114.252', distro: 'Ubuntu', version: '26.04 LTS',
    kernel: '7.0.0-30-generic', arch: 'x86_64', virt: 'KVM', hypervisor: 'KVM', cpuModel: 'AMD EPYC Processor (with IBPB)',
    vcpus: 6, ram: 11, swap: 8, fsType: 'ext4', fsDevice: '/dev/sda1', fsSize: 193, tz: 'Europe/Berlin',
    timeSync: 'Enabled · synchronized', docker: '29.7.2', storageDriver: 'overlayfs', deployDir: '/opt'
  };
  D.measure = {
    ramTotal: 11, ramUsed: 8.1, ramAvail: 3.5, swapTotal: 8, swapUsed: 4.6, swapAvail: 3.4,
    diskTotal: 193, diskUsed: 56, diskAvail: 138, diskUtil: 29, uptime: '≈ 6 weeks',
    containers: 64, running: 63, exited: 1, images: 125, networks: 20
  };

  // role: [label, kind, simCpu(% of one vCPU), simMemMiB]
  D.roles = {
    app: ['Application service', 'app', 3, 220], frontend: ['Frontend', 'app', 0.6, 55], backend: ['Backend', 'app', 3.5, 210],
    api: ['API service', 'app', 3.8, 240], web: ['Web frontend', 'app', 0.8, 70], admin: ['Admin interface', 'app', 0.3, 60],
    portal: ['Portal', 'app', 0.4, 70], gateway: ['Gateway', 'app', 1.6, 110], server: ['Application server', 'app', 2.2, 160],
    evo: ['Evolution API service', 'app', 4, 300], n8n: ['Workflow engine (n8n)', 'app', 3, 320],
    db: ['Database · engine not identified', 'data', 1.8, 150], postgres: ['PostgreSQL', 'data', 2, 170],
    redis: ['Redis', 'cache', 0.6, 28], minio: ['MinIO object storage', 'data', 0.5, 140],
    worker: ['Celery worker', 'worker', 3, 250], beat: ['Celery beat scheduler', 'worker', 0.2, 90],
    job: ['Migration task', 'job', 0, 0], proxy: ['Nginx (containerized)', 'proxy', 0.1, 10],
    mta: ['Postfix MTA', 'mail', 0.5, 60], imap: ['Dovecot IMAP / POP3', 'mail', 0.6, 55], spam: ['Rspamd spam filter', 'mail', 1.4, 170],
    dns: ['Unbound DNS resolver', 'mail', 0.2, 35], av: ['ClamAV antivirus', 'mail', 1.5, 980], olefy: ['Olefy macro scanner', 'mail', 0.1, 28],
    submission: ['Submission gateway', 'mail', 0.3, 45], policy: ['Mail policy service', 'mail', 0.2, 40],
    grafana: ['Grafana', 'monitor', 0.5, 120], prometheus: ['Prometheus', 'monitor', 1.8, 290], exporter: ['Node exporter', 'monitor', 0.2, 16],
    alertmanager: ['Alertmanager', 'monitor', 0.1, 28]
  };
  D.kinds = { app: 'Application', data: 'Data store', cache: 'Cache / broker', worker: 'Background worker', job: 'One-time job', proxy: 'Proxy', mail: 'Mail infrastructure', monitor: 'Monitoring' };

  D.apps = [
    ['deltawave', 'DeltaWave', ['deltawave']], ['evolutionapi', 'EvolutionAPI', ['evolutionapi']], ['hermes', 'Hermes', []],
    ['honrisesol', 'HonriseSol', ['honrisesol']], ['mateassist', 'MateAssist', ['mateassist']], ['matecrm', 'MateCRM', ['matecrm']],
    ['mateconnect', 'MateConnect', ['mateconnect']], ['matedesk', 'MateDesk', ['matedesk']], ['mateerp', 'MateERP', ['mateerp']],
    ['matemail', 'MateMail', ['matemail', 'matemail-native', 'matemail-monitoring']], ['myright', 'MyRight', ['myright']],
    ['netamate', 'NetaMate', ['netamate']], ['portfolio', 'Portfolio', ['portfolio']], ['talkroom', 'TalkRoom', []], ['n8n', 'n8n', ['n8n']]
  ].map(function (a) { return { id: a[0], name: a[1], dir: '/opt/' + a[1], compose: a[2] }; });
  D.apps.forEach(function (a) {
    a.deploy = a.compose.length ? 'Docker Compose' : (a.id === 'talkroom' ? 'Docker container · no Compose label observed' : 'Not determined');
    a.deployProv = a.compose.length ? 'verified' : (a.id === 'talkroom' ? 'inferred' : 'unknown');
  });

  var C = [
    'deltawave-app-1|deltawave|deltawave|app', 'deltawave-db-1|deltawave|deltawave|db',
    'honrisesol-app|honrisesol|honrisesol|app', 'honrisesol-postgres|honrisesol|honrisesol|postgres',
    'netamate-frontend-1|netamate|netamate|frontend', 'netamate-backend-1|netamate|netamate|backend', 'netamate-db-1|netamate|netamate|db',
    'mateerp-frontend-1|mateerp|mateerp|frontend', 'mateerp-backend-1|mateerp|mateerp|backend', 'mateerp-database-1|mateerp|mateerp|db',
    'matecrm-frontend-1|matecrm|matecrm|frontend', 'matecrm-backend-1|matecrm|matecrm|backend', 'matecrm-database-1|matecrm|matecrm|db',
    'matedesk-frontend-1|matedesk|matedesk|frontend', 'matedesk-backend-1|matedesk|matedesk|backend', 'matedesk-postgres-1|matedesk|matedesk|postgres',
    'matedesk-redis-1|matedesk|matedesk|redis', 'matedesk-celery_worker-1|matedesk|matedesk|worker', 'matedesk-celery_beat-1|matedesk|matedesk|beat',
    'mateconnect-api-1|mateconnect|mateconnect|api', 'mateconnect-web-1|mateconnect|mateconnect|web', 'mateconnect-gateway-1|mateconnect|mateconnect|gateway',
    'mateconnect-postgres-1|mateconnect|mateconnect|postgres', 'mateconnect-redis-1|mateconnect|mateconnect|redis',
    'mateassist-backend-1|mateassist|mateassist|backend', 'mateassist-admin-1|mateassist|mateassist|admin', 'mateassist-portal-1|mateassist|mateassist|portal',
    'mateassist-celery_worker-1|mateassist|mateassist|worker', 'mateassist-celery_beat-1|mateassist|mateassist|beat', 'mateassist-redis-1|mateassist|mateassist|redis',
    'mateassist-postgres-1|mateassist|mateassist|postgres', 'mateassist-minio-1|mateassist|mateassist|minio',
    'evolution_api|evolutionapi|evolutionapi|evo', 'evo_redis|evolutionapi|evolutionapi|redis', 'evo_postgres|evolutionapi|evolutionapi|postgres',
    'n8n|n8n|n8n|n8n',
    'myright-frontend-1|myright|myright|frontend', 'myright-backend-1|myright|myright|backend', 'myright-postgres-1|myright|myright|postgres',
    'portfolio-web-1|portfolio|portfolio|web', 'portfolio-nginx-1|portfolio|portfolio|proxy',
    'talkroom-server|talkroom||server',
    'matemail-frontend-1|matemail|matemail|frontend', 'matemail-backend-1|matemail|matemail|backend', 'matemail-postgres-1|matemail|matemail|postgres',
    'matemail-redis-1|matemail|matemail|redis', 'matemail-celery-worker-1|matemail|matemail|worker', 'matemail-celery-beat-1|matemail|matemail|beat',
    'matemail-migrate-1|matemail|matemail|job',
    'matemail-native-api|matemail|matemail-native|api', 'matemail-native-db|matemail|matemail-native|db', 'matemail-native-redis|matemail|matemail-native|redis',
    'matemail-native-postfix|matemail|matemail-native|mta', 'matemail-native-dovecot|matemail|matemail-native|imap', 'matemail-native-rspamd|matemail|matemail-native|spam',
    'matemail-native-unbound|matemail|matemail-native|dns', 'matemail-native-clamav|matemail|matemail-native|av', 'matemail-native-olefy|matemail|matemail-native|olefy',
    'matemail-native-submission-gateway|matemail|matemail-native|submission', 'matemail-native-policy|matemail|matemail-native|policy',
    'matemail-grafana|matemail|matemail-monitoring|grafana', 'matemail-prometheus|matemail|matemail-monitoring|prometheus',
    'matemail-node-exporter|matemail|matemail-monitoring|exporter', 'matemail-alertmanager|matemail|matemail-monitoring|alertmanager'
  ];
  D.containers = C.map(function (s) {
    var p = s.split('|'), name = p[0], proj = p[2] || null, role = p[3], r = D.roles[role];
    var std = proj && new RegExp('^' + proj.replace(/[-]/g, '\\-') + '-(.+)-\\d+$').exec(name);
    var service = std ? std[1] : (proj && name.indexOf(proj + '-') === 0 ? name.slice(proj.length + 1) : name);
    var exited = name === 'matemail-migrate-1';
    return {
      name: name, app: p[1], compose: proj, composeProv: proj ? (std ? 'verified' : 'inferred') : 'unknown', service: service,
      role: role, roleLabel: r[0], kind: r[1], state: exited ? 'exited' : 'running', workload: role === 'job' ? 'job' : 'service',
      simCpu: r[2], simMem: r[3] * 0.7
    };
  });

  D.compose = ['deltawave', 'evolutionapi', 'honrisesol', 'mateassist', 'mateconnect', 'matecrm', 'matedesk', 'mateerp', 'matemail', 'matemail-native', 'matemail-monitoring', 'myright', 'n8n', 'netamate', 'portfolio'].map(function (n) {
    var role = { 'matemail': 'Mail application', 'matemail-native': 'Native mail engine', 'matemail-monitoring': 'Monitoring stack' }[n] || 'Application stack';
    return { name: n, role: role, app: D.containers.filter(function (c) { return c.compose === n; })[0].app };
  });

  // [name, driver, scope-kind, projects(inferred from name), confidence]
  D.networks = [
    ['bridge', 'bridge', 'default', [], ''], ['host', 'host', 'default', [], ''], ['none', 'null', 'default', [], ''],
    ['deltawave_net', '', 'project', ['deltawave'], 'h'], ['evolutionapi_default', '', 'project', ['evolutionapi'], 'h'],
    ['honrisesol_honrise_private', '', 'project', ['honrisesol'], 'h'], ['mateassist_internal', '', 'project', ['mateassist'], 'h'],
    ['mateconnect_internal', '', 'project', ['mateconnect'], 'h'], ['matecrm_internal', '', 'project', ['matecrm'], 'h'],
    ['matedesk_internal', '', 'project', ['matedesk'], 'h'], ['mateerp_internal', '', 'project', ['mateerp'], 'h'],
    ['matemail_engine_link', '', 'project', ['matemail', 'matemail-native'], 'l'], ['matemail_matemail_app', '', 'project', ['matemail'], 'm'],
    ['matemail_matemail_internal', '', 'project', ['matemail'], 'm'], ['matemail_monitoring', '', 'project', ['matemail-monitoring'], 'm'],
    ['matemail_native_engine', '', 'project', ['matemail-native'], 'm'], ['myright_internal', '', 'project', ['myright'], 'h'],
    ['n8n_default', '', 'project', ['n8n'], 'h'], ['netamate_internal', '', 'project', ['netamate'], 'h'], ['portfolio_default', '', 'project', ['portfolio'], 'h']
  ].map(function (n) { return { name: n[0], driver: n[1], kind: n[2], projects: n[3], conf: n[4] }; });

  // name|apex|app|confidence(h/m/l/u)|target container|note
  var DM = [
    'netamate.com|netamate.com|netamate|h|netamate-frontend-1', 'www.netamate.com|netamate.com|netamate|h|netamate-frontend-1',
    'crm.netamate.com|netamate.com|matecrm|m|matecrm-frontend-1', 'erp.netamate.com|netamate.com|mateerp|m|mateerp-frontend-1',
    'helpdesk.netamate.com|netamate.com|matedesk|m|matedesk-frontend-1', 'evo.netamate.com|netamate.com|evolutionapi|m|evolution_api',
    'n8n.netamate.com|netamate.com|n8n|h|n8n', 'hermes.netamate.com|netamate.com|hermes|m||No Hermes runtime component was observed',
    'insights.netamate.com|netamate.com||u||No observed component name corresponds to this host',
    'mailhub.netamate.com|netamate.com|matemail|l|', 'postbox.netamate.com|netamate.com|matemail|l|',
    'mta-sts.netamate.com|netamate.com|matemail|l||MTA-STS policy host; serving component not identified',
    'matemail.pro|matemail.pro|matemail|h|matemail-frontend-1', 'www.matemail.pro|matemail.pro|matemail|h|matemail-frontend-1',
    'app.matemail.pro|matemail.pro|matemail|h|matemail-frontend-1', 'hub.matemail.pro|matemail.pro|matemail|m|',
    'platform.matemail.pro|matemail.pro|matemail|m|', 'portal.matemail.pro|matemail.pro|matemail|m|', 'postbox.matemail.pro|matemail.pro|matemail|m|',
    'mx.matemail.pro|matemail.pro|matemail|m||Mail exchanger hostname with an HTTP server block',
    'autodiscover.matemail.pro|matemail.pro|matemail|m|', 'mta-sts.mail.matemail.pro|matemail.pro|matemail|m||MTA-STS policy host',
    'mateconnect.pro|mateconnect.pro|mateconnect|h|mateconnect-web-1', 'www.mateconnect.pro|mateconnect.pro|mateconnect|h|mateconnect-web-1',
    'app.mateconnect.pro|mateconnect.pro|mateconnect|h|mateconnect-web-1', 'api.mateconnect.pro|mateconnect.pro|mateconnect|h|mateconnect-api-1',
    'gateway.mateconnect.pro|mateconnect.pro|mateconnect|h|mateconnect-gateway-1',
    'turn.mateconnect.pro|mateconnect.pro|mateconnect|l||No TURN component was observed among containers',
    'fieldlab.mateconnect.pro|mateconnect.pro||u||No running component corresponds to this host. Archived directory names are not evidence of routing.',
    'gateway-fieldlab.mateconnect.pro|mateconnect.pro||u||No running component corresponds to this host. Archived directory names are not evidence of routing.',
    '*.mateconnect.pro|mateconnect.pro|mateconnect|m||Wildcard declaration',
    'mateassist.site|mateassist.site|mateassist|h|', 'www.mateassist.site|mateassist.site|mateassist|h|', '*.mateassist.site|mateassist.site|mateassist|m||Wildcard declaration',
    'matedesk.pro|matedesk.pro|matedesk|h|matedesk-frontend-1', 'www.matedesk.pro|matedesk.pro|matedesk|h|matedesk-frontend-1',
    '*.matedesk.pro|matedesk.pro|matedesk|m||Wildcard declaration', 'mta-sts.matedesk.pro|matedesk.pro|matemail|l||MTA-STS policy host; serving component not identified',
    'deltawave.tech|deltawave.tech|deltawave|h|deltawave-app-1', 'www.deltawave.tech|deltawave.tech|deltawave|h|deltawave-app-1',
    'honrisesolutions.com.sg|honrisesolutions.com.sg|honrisesol|h|honrisesol-app', 'www.honrisesolutions.com.sg|honrisesolutions.com.sg|honrisesol|h|honrisesol-app',
    'myrightbd.org|myrightbd.org|myright|h|myright-frontend-1', 'www.myrightbd.org|myrightbd.org|myright|h|myright-frontend-1',
    'mail.myrightbd.org|myrightbd.org|matemail|l|', 'mailhub.myrightbd.org|myrightbd.org|matemail|l|',
    'mta-sts.myrightbd.org|myrightbd.org|matemail|l||MTA-STS policy host; serving component not identified',
    'talkroom.club|talkroom.club|talkroom|h|talkroom-server', 'www.talkroom.club|talkroom.club|talkroom|h|talkroom-server',
    'rizwansammo.me|rizwansammo.me|portfolio|m|portfolio-nginx-1', 'www.rizwansammo.me|rizwansammo.me|portfolio|m|portfolio-nginx-1'
  ];
  D.domains = DM.map(function (s) {
    var p = s.split('|');
    return { name: p[0], apex: p[1], app: p[2] || null, conf: p[3], target: p[4] || null, note: p[5] || '', wildcard: p[0].charAt(0) === '*' };
  });

  // Directories. basis: owner | observed | inferred | verify
  D.categories = { root: 'Deployment root', production: 'Production application', infra: 'Supporting infrastructure', backup: 'Backup', recovery: 'Recovery', archive: 'Archived', devtest: 'Development or testing', unknown: 'Unknown' };
  D.dirs = [{ path: '/opt', name: 'opt', parent: '/', cat: 'root', basis: 'observed', note: 'Primary deployment directory. 17 top-level directories observed.' }];
  ['Archived', 'DeltaWave', 'EvolutionAPI', 'Hermes', 'HonriseSol', 'MateAssist', 'MateCRM', 'MateConnect', 'MateDesk', 'MateERP', 'MateMail', 'MyRight', 'NetaMate', 'Portfolio', 'TalkRoom', 'mateserver-backup', 'n8n'].forEach(function (n) {
    var app = D.apps.filter(function (a) { return a.name === n; })[0];
    var d = { path: '/opt/' + n, name: n, parent: '/opt' };
    if (app) { d.cat = 'production'; d.basis = 'owner'; d.app = app.id; d.note = 'Identified by the server owner as a production deployment.'; }
    else if (n === 'Archived') { d.cat = 'archive'; d.basis = 'observed'; d.note = 'Holds five directories moved out of the active /opt namespace. Being archived does not establish that contents are unused or safe to remove.'; }
    else { d.cat = 'backup'; d.basis = 'owner'; d.note = 'Associated with MateServer backup infrastructure. Not an application deployment.'; }
    D.dirs.push(d);
  });
  [['MateConnect-Phase2-Lab', 'devtest', 'inferred', 'Name suggests a lab or test environment. No relationship to running MateConnect components has been established.'],
   ['containerd', 'unknown', 'verify', 'Name resembles container-runtime state. Whether anything depends on it has not been established.'],
   ['migration-backups', 'backup', 'inferred', 'Name suggests backups taken during a migration.'],
   ['mateserver-restore', 'recovery', 'inferred', 'Name suggests recovery or restore material.'],
   ['retired', 'archive', 'inferred', 'Name suggests decommissioned content.']].forEach(function (x) {
    D.dirs.push({ path: '/opt/Archived/' + x[0], name: x[0], parent: '/opt/Archived', cat: x[1], basis: x[2], note: x[3], archived: true });
  });

  D.hostServices = [
    { id: 'dockerd', name: 'Docker Engine', unit: 'docker.service', cat: 'Container runtime', version: '29.7.2', prov: 'verified', state: 'Running', stateProv: 'inferred', note: 'Engine version and overlayfs storage driver verified. Running state inferred from 63 running containers.' },
    { id: 'containerd', name: 'containerd', unit: 'containerd.service', cat: 'Container runtime', version: 'Not captured', prov: 'inferred', state: 'Not captured', stateProv: 'unknown', note: 'Docker Engine relies on containerd. Unit name and version were not captured. Unrelated to /opt/Archived/containerd until verified.' },
    { id: 'compose', name: 'Docker Compose', unit: 'CLI plugin', cat: 'Orchestration', version: 'Not captured', prov: 'inferred', state: 'n/a (CLI)', stateProv: 'inferred', note: 'Compose project labels were observed on containers. Plugin version was not captured.' },
    { id: 'nginx', name: 'Nginx', unit: 'nginx.service', cat: 'Reverse proxy', version: 'Not captured', prov: 'inferred', state: 'Not captured', stateProv: 'unknown', note: 'server_name declarations were read from Nginx configuration. Process state and version were not captured. Separate from the portfolio-nginx-1 container.' },
    { id: 'sshd', name: 'OpenSSH server', unit: 'ssh.service', cat: 'Remote access', version: 'Not captured', prov: 'unknown', state: 'Not captured', stateProv: 'unknown', note: 'Typical on a VPS but not verified by the inspection. KeepUp never connects over SSH.' },
    { id: 'timesync', name: 'Time synchronization', unit: 'Not identified', cat: 'System clock', version: '—', prov: 'verified', state: 'Synchronized', stateProv: 'historical', note: 'Synchronization enabled and synchronized on 17 Oct 2026. The daemon (e.g. systemd-timesyncd or chrony) was not identified.' },
    { id: 'cron', name: 'Host scheduled tasks', unit: 'cron / systemd timers', cat: 'Scheduling', version: '—', prov: 'unknown', state: 'Not inspected', stateProv: 'unknown', note: 'Host-level schedules were not inspected. Containerized schedulers (Celery beat) are listed under Docker.' }
  ];
  D.ports = [
    { port: '22/tcp', svc: 'sshd', label: 'OpenSSH server', prov: 'unknown', basis: 'Conventional SSH port; binding not captured.' },
    { port: '80/tcp', svc: 'nginx', label: 'Nginx', prov: 'inferred', basis: 'Nginx serves HTTP server blocks for declared domains.' },
    { port: '443/tcp', svc: 'nginx', label: 'Nginx', prov: 'inferred', basis: 'HTTPS endpoints declared in Nginx configuration.' },
    { port: '25/tcp', svc: 'matemail-native-postfix', label: 'Postfix MTA', prov: 'inferred', basis: 'Postfix container present; published ports not captured.' },
    { port: '465/tcp', svc: 'matemail-native-submission-gateway', label: 'Submission gateway', prov: 'inferred', basis: 'Submission gateway container present; published ports not captured.' },
    { port: '587/tcp', svc: 'matemail-native-submission-gateway', label: 'Submission gateway', prov: 'inferred', basis: 'Submission gateway container present; published ports not captured.' },
    { port: '993/tcp', svc: 'matemail-native-dovecot', label: 'Dovecot IMAPS', prov: 'inferred', basis: 'Dovecot container present; published ports not captured.' }
  ];

  // Observations from the reference snapshot (simulated ones are computed live in the UI)
  D.observations = [
    { id: 'o-hermes', sev: 'warning', title: 'Hermes has no detected runtime', res: { type: 'app', id: 'hermes' }, app: 'hermes', prov: 'historical',
      text: '/opt/Hermes exists and hermes.netamate.com is declared in Nginx, but no container or Compose project associated with Hermes was observed. It may run as a host process, be served from elsewhere, or be inactive. Its health is unknown — not assumed healthy.',
      metrics: [['Containers', '0'], ['Compose projects', '0'], ['Declared domains', '1 (inferred)'], ['Directory', '/opt/Hermes']] },
    { id: 'o-swap', sev: 'info', title: 'Swap 57% occupied — activity not measured', res: { type: 'view', id: 'metrics' }, prov: 'historical',
      text: 'On 17 Oct 2026, 4.6 of 8 GiB swap was in use while 3.5 GiB memory remained available. Occupied swap often holds idle pages and is not by itself evidence of memory pressure. Swap-in/out rates were not captured, so pressure cannot be confirmed or ruled out.',
      metrics: [['Swap used', '4.6 / 8.0 GiB'], ['Memory available', '3.5 GiB'], ['Swap activity', 'Not captured']] },
    { id: 'o-migrate', sev: 'info', title: 'matemail-migrate-1 exited', res: { type: 'container', id: 'matemail-migrate-1' }, app: 'matemail', prov: 'historical',
      text: 'The only exited container of 64. Its name indicates a one-time migration task, which normally exits after completing. The exit code was not captured, so success is unconfirmed. It is not counted as a failure.',
      metrics: [['State', 'Exited'], ['Workload', 'One-time job (inferred)'], ['Exit code', 'Not captured'], ['Compose project', 'matemail']] },
    { id: 'o-apphealth', sev: 'unknown', title: 'Application health is not verified', res: { type: 'view', id: 'apps' }, prov: 'verified',
      text: 'No HTTP or application health probes are configured. A running container does not prove an application is serving correctly, so all 15 production applications report health as Unknown.',
      metrics: [['Applications', '15'], ['Health probes', 'None configured']] },
    { id: 'o-dns', sev: 'unmonitored', title: 'Domains, DNS and TLS not probed', res: { type: 'view', id: 'domains' }, prov: 'verified',
      text: '51 server_name declarations were read from Nginx configuration. Declarations do not verify public DNS resolution, external reachability, TLS validity or upstream ownership.',
      metrics: [['Declarations', '51'], ['DNS checks', 'None'], ['TLS checks', 'None']] },
    { id: 'o-unmapped', sev: 'info', title: '3 declared hosts have no matching component', res: { type: 'domain', id: 'insights.netamate.com' }, prov: 'inferred',
      text: 'insights.netamate.com, fieldlab.mateconnect.pro and gateway-fieldlab.mateconnect.pro are declared in Nginx, but no observed application, container or host service corresponds to them by name. Their upstream targets were not captured.',
      metrics: [['Unmapped hosts', '3'], ['Upstream targets', 'Not captured']] },
    { id: 'o-talkroom', sev: 'info', title: 'TalkRoom runs without a Compose label', res: { type: 'container', id: 'talkroom-server' }, app: 'talkroom', prov: 'historical',
      text: 'talkroom-server is running but no Compose project label was observed for it. Its deployment method is inferred as a standalone container.',
      metrics: [['Container', 'talkroom-server'], ['Compose project', 'None observed']] },
    { id: 'o-ctrmetrics', sev: 'unmonitored', title: 'Per-container resource usage not captured', res: { type: 'view', id: 'resources' }, prov: 'verified',
      text: 'The reference inspection recorded container states but not CPU, memory or network usage per container. Attribution of the 8.1 GiB used memory to applications is not possible from the snapshot.',
      metrics: [['Containers with metrics', '0 of 64']] },
    { id: 'o-archived', sev: 'info', title: 'Archived contents require classification', res: { type: 'dir', id: '/opt/Archived' }, prov: 'inferred',
      text: 'Five directories sit under /opt/Archived. Their classifications are inferred from names only. Archived content is kept visible; KeepUp makes no cleanup recommendation.',
      metrics: [['Directories', '5'], ['Confirmed classifications', '0 of 5']] },
    { id: 'o-monitoring', sev: 'info', title: 'MateMail monitoring stack is present', res: { type: 'compose', id: 'matemail-monitoring' }, app: 'matemail', prov: 'historical',
      text: 'Prometheus, Grafana, Alertmanager and a node exporter run as the matemail-monitoring Compose project. KeepUp does not read from them in this prototype.',
      metrics: [['Containers', '4 running']] },
    { id: 'o-disk', sev: 'healthy', title: 'Root filesystem has ample headroom', res: { type: 'view', id: 'storage' }, prov: 'historical',
      text: '/dev/sda1 (ext4) was 29% utilized with 138 GB available on 17 Oct 2026.',
      metrics: [['Used', '56 GB'], ['Available', '138 GB'], ['Utilization', '29%']] },
    { id: 'o-time', sev: 'healthy', title: 'System clock synchronized', res: { type: 'service', id: 'timesync' }, prov: 'historical',
      text: 'Time synchronization was enabled and synchronized. Server timezone is Europe/Berlin.', metrics: [['Timezone', 'Europe/Berlin']] },
    { id: 'o-services', sev: 'healthy', title: 'All service containers in running state', res: { type: 'view', id: 'docker' }, prov: 'historical',
      text: '63 of 63 long-running service containers were running. The single exited container is a one-time task. Running state is not the same as verified health.',
      metrics: [['Running', '63'], ['Exited (job)', '1'], ['Failed', '0 observed']] }
  ];

  // ---- Simulated / representative values (Demo mode only) ----
  D.sim = {
    dirGB: { '/opt/Archived': 3.9, '/opt/Archived/MateConnect-Phase2-Lab': 1.6, '/opt/Archived/containerd': 0.9, '/opt/Archived/migration-backups': 0.8, '/opt/Archived/mateserver-restore': 0.5, '/opt/Archived/retired': 0.1,
      '/opt/DeltaWave': 0.12, '/opt/EvolutionAPI': 0.35, '/opt/Hermes': 0.09, '/opt/HonriseSol': 0.21, '/opt/MateAssist': 0.48, '/opt/MateCRM': 0.31, '/opt/MateConnect': 0.62,
      '/opt/MateDesk': 0.44, '/opt/MateERP': 0.38, '/opt/MateMail': 0.95, '/opt/MyRight': 0.27, '/opt/NetaMate': 0.41, '/opt/Portfolio': 0.08, '/opt/TalkRoom': 0.06,
      '/opt/mateserver-backup': 1.8, '/opt/n8n': 0.15 },
    docker: [['Images', 19.6], ['Volumes', 13.4], ['Build cache', 3.0], ['Writable layers', 1.1], ['Container logs', 0.9]],
    hostProcs: [['dockerd', 1.2, 310], ['containerd', 0.6, 120], ['nginx (4 workers)', 0.9, 96], ['systemd-journald', 0.2, 64], ['sshd', 0.0, 9], ['Other host processes', 1.1, 420]]
  };

  // ---- Relations ----
  var by = function (arr, k) { var m = {}; arr.forEach(function (x) { m[x[k]] = x; }); return m; };
  D.appById = by(D.apps, 'id'); D.cByName = by(D.containers, 'name'); D.composeByName = by(D.compose, 'name');
  D.netByName = by(D.networks, 'name'); D.domByName = by(D.domains, 'name'); D.dirByPath = by(D.dirs, 'path'); D.svcById = by(D.hostServices, 'id');
  D.compose.forEach(function (p) {
    p.containers = D.containers.filter(function (c) { return c.compose === p.name; }).map(function (c) { return c.name; });
    p.networks = D.networks.filter(function (n) { return n.projects.indexOf(p.name) >= 0; }).map(function (n) { return n.name; });
  });
  D.networks.forEach(function (n) { n.apps = n.projects.map(function (p) { return D.composeByName[p].app; }).filter(function (v, i, a) { return a.indexOf(v) === i; }); });
  D.apps.forEach(function (a) {
    a.containers = D.containers.filter(function (c) { return c.app === a.id; }).map(function (c) { return c.name; });
    a.domains = D.domains.filter(function (d) { return d.app === a.id; }).map(function (d) { return d.name; });
    a.networks = D.networks.filter(function (n) { return n.apps.indexOf(a.id) >= 0; }).map(function (n) { return n.name; });
  });
  D.dirs.forEach(function (d) { d.children = D.dirs.filter(function (x) { return x.parent === d.path; }).map(function (x) { return x.path; }); });

  // Representative images & volumes (Demo mode only)
  var img = { postgres: 'postgres:16-alpine', redis: 'redis:7-alpine', minio: 'minio/minio:latest', n8n: 'n8nio/n8n:latest', grafana: 'grafana/grafana:latest',
    prometheus: 'prom/prometheus:latest', exporter: 'prom/node-exporter:latest', alertmanager: 'prom/alertmanager:latest', proxy: 'nginx:alpine' };
  var mountFor = { postgres: '/var/lib/postgresql/data', db: '/var/lib/data', redis: '/data', minio: '/data', grafana: '/var/lib/grafana', prometheus: '/prometheus', n8n: '/home/node/.n8n' };
  D.simVolumes = [];
  D.containers.forEach(function (c) {
    c.simImage = img[c.role] || ((c.compose || c.app) + '-' + c.service.replace(/[_]/g, '-') + ':local');
    if (mountFor[c.role]) {
      var v = { name: (c.compose || c.app).replace(/-/g, '_') + '_' + c.service.replace(/-/g, '_') + '_data', container: c.name, mount: mountFor[c.role], app: c.app };
      D.simVolumes.push(v); c.simVolume = v.name;
    }
  });
  var imgs = {}; D.containers.forEach(function (c) { (imgs[c.simImage] = imgs[c.simImage] || []).push(c.name); });
  D.simImages = Object.keys(imgs).sort().map(function (k) { return { name: k, used: imgs[k] }; });
  window.KU = D;
})();
