# Trident CRM on Railway — one install per client

Trident's pilot: project `trident-crm` (Supram workspace), region **EU West (Amsterdam)**.
Script it (`scripts/new-client.sh`) at client #2; until then follow these steps.

## Services

| Service | Source | Notes |
|---|---|---|
| `server` | `ghcr.io/supram12/trident-crm:v2.9.0-trident.N` | Domain on port 3000. Runs DB migrations + cron registration on boot. |
| `worker` | same image | Start command `node dist/queue-worker/queue-worker`. |
| `Postgres` | `railway add --database postgres` | Turn on daily backups in the dashboard. |
| `Redis` | `railway add --database redis` | Default policy is `noeviction`, which Twenty needs. |
| bucket `crm-files` | `railway bucket create crm-files --region ams` | File storage. Server and worker can't share a volume, so files go here. |

**Never deploy `v2.9.0-trident.1`** — it is upstream's all-in-one dev image (embedded Postgres, dev secret).

## Steps

```bash
cd trident-crm   # railway links THIS directory
railway init --name trident-crm-<client> --workspace <workspace-id>
railway add --database postgres
railway add --database redis
railway add --service server --image ghcr.io/supram12/trident-crm:<tag> --variables ...   # see below
railway add --service worker --image ghcr.io/supram12/trident-crm:<tag> --variables ... \
  --variables DISABLE_DB_MIGRATIONS=true --variables DISABLE_CRON_JOBS_REGISTRATION=true
railway domain --service server --port 3000
railway bucket create crm-files --region ams
railway bucket credentials --bucket crm-files --json   # access key, secret, bucket name
```

`railway environment edit --service-config` reported "No changes to apply" for
`deploy.startCommand` and regions on CLI 4.40, so the worker start command and
the EU region were set with the public GraphQL API
(`serviceInstanceUpdate(serviceId, environmentId, input: {startCommand | multiRegionConfig})`,
bearer = `accessToken` from `~/.railway/config.json`). Set the region **before**
any data exists: a region move migrates the volumes.

## Variables (server and worker, identical except the two `DISABLE_*` on worker)

| Variable | Value |
|---|---|
| `SERVER_URL` | `https://<client domain>` — mandatory (email logo is served from it) |
| `APP_SECRET` | `openssl rand -hex 32`, same on both services |
| `PG_DATABASE_URL` | `${{Postgres.DATABASE_URL}}` |
| `REDIS_URL` | `${{Redis.REDIS_URL}}` |
| `NODE_PORT` | `3000` |
| `PORT` | `3000` (server only). `railway domain --port` didn't save a target port on CLI 4.40, so the proxy used Railway's default port and every request got a 4 ms 502 |
| `STORAGE_TYPE` | `s3` |
| `STORAGE_S3_NAME` / `_ENDPOINT` | from bucket credentials (`https://t3.storageapi.dev`) |
| `STORAGE_S3_REGION` | `eu-west-1` (Twenty rejects the bucket's `auto`; any valid region signs fine) |
| `STORAGE_S3_ACCESS_KEY_ID` / `_SECRET_ACCESS_KEY` | from bucket credentials, set with `--stdin` |
| `TELEMETRY_ENABLED` | `false` |
| `IS_MULTIWORKSPACE_ENABLED` | `false` |
| `EMAIL_DRIVER` | `smtp` |
| `EMAIL_SMTP_HOST` / `_PORT` | `smtp.gmail.com` / `465` |
| `EMAIL_SMTP_USER` | the sending Gmail address |
| `EMAIL_SMTP_PASSWORD` | Gmail app password, set with `railway variable set EMAIL_SMTP_PASSWORD --stdin --service <s>` |
| `EMAIL_FROM_ADDRESS` / `EMAIL_FROM_NAME` | sending address / `Trident CRM` |

## Custom domain

`railway domain --service server <domain> --port 3000`, add the CNAME it prints
at the client's DNS host, set `SERVER_URL` to it on both services, redeploy.
