import axios from 'axios'

type IpScanResult = {
  query?: string
  status: string
  country?: string
  regionName?: string
  city?: string
  district?: string
  isp?: string
  org?: string
}

export async function scanIpAddress(ip: string): Promise<IpScanResult> {
  const endpoint = `http://ip-api.com/json/${ip}?fields=status,message,country,regionName,city,district,isp,org,query`

  try {
    const response = await axios.get(endpoint)
    const data = response.data

    if (data.status === 'success') {
      return data
    } else {
      console.error('IP lookup failed:', data.message)
      return { status: 'fail' }
    }
  } catch (err) {
    console.error('IP lookup failed:', err)
    return { status: 'error' }
  }
}
