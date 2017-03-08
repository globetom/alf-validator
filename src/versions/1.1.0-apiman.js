import clone from 'stringify-clone'
import _content from '../../schemas/1.1.0-apiman/content.json'
import _creator from '../../schemas/1.1.0-apiman/creator.json'
import _data from '../../schemas/1.1.0-apiman/data.json'
import _entry from '../../schemas/1.1.0-apiman/entry.json'
import _log from '../../schemas/1.1.0-apiman/log.json'
import _pairs from '../../schemas/1.1.0-apiman/pairs.json'
import _request from '../../schemas/1.1.0-apiman/request.json'
import _response from '../../schemas/1.1.0-apiman/response.json'
import _timings from '../../schemas/1.1.0-apiman/timings.json'

let content = clone(_content)
let creator = clone(_creator)
let data = clone(_data)
let entry = clone(_entry)
let log = clone(_log)
let pairs = clone(_pairs)
let request = clone(_request)
let response = clone(_response)
let timings = clone(_timings)

/*
 * copy external schemas internally
 * is-my-json-valid does not provide meaningful error messages for external schemas
 */

request.properties.headers.items = pairs
request.properties.queryString.items = pairs

response.properties.headers.items = pairs

data.properties.data = content

entry.properties.request = request
entry.properties.response = response
entry.properties.data = data
entry.properties.timings = timings

log.properties.har.properties.log.creator = creator
log.properties.har.properties.log.properties.entries.items = entry

export const single = log
export const multi = {
  type: 'array',
  minItems: 1,
  items: log,
  additionalProperties: false
}
