export const config = {
  runtime: 'edge',
}

const API_BASE = 'https://vortex.worldofwarships.eu/api/encyclopedia/en/'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Max-Age': '86400',
}

const buildTargetUrl = (requestUrl: URL) => {
  const relativePath = requestUrl.pathname.replace(/^\/api\/wows\/?/, '')
  const target = new URL(relativePath || '', API_BASE)
  target.search = requestUrl.search
  return target
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  try {
    const url = new URL(request.url)
    const targetUrl = buildTargetUrl(url)
    const upstream = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        accept: request.headers.get('accept') ?? 'application/json',
      },
    })

    const headers = new Headers(upstream.headers)
    Object.entries(corsHeaders).forEach(([key, value]) => headers.set(key, value))

    return new Response(upstream.body, {
      status: upstream.status,
      headers,
    })
  } catch (error) {
    const body =
      error instanceof Error
        ? { error: 'ProxyError', message: error.message }
        : { error: 'ProxyError', message: String(error) }
    return new Response(JSON.stringify(body), {
      status: 500,
      headers: {
        ...corsHeaders,
        'content-type': 'application/json',
      },
    })
  }
}
