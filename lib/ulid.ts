// So this is incredibly annoying, but CloudFlare likes to monkey with time for "security reasons"
// The result is that ulid() returns the same garbage values. So we have to use a cloudflare-speicic
// ulid implementation when we detect cloudflare: https://github.com/ryan-mars/ulid-workers

import { ulid as ulidVanilla } from 'ulid'
import { ulidFactory as ulidCloudFlare} from "ulid-workers"

const isCloudFlare = navigator.userAgent === "Cloudflare-Workers"
console.log('ulid: using cloudflare version?', isCloudFlare)

export const ulid = isCloudFlare ? ulidCloudFlare({ monotonic: true }) : ulidVanilla
