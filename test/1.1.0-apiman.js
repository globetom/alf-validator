import * as fixtures from './fixtures/1.1.0-apiman/'
import ALFError from '../src/error'
import tap from 'tap'
import validate from '../src/promise'

const errors = {
  object: new ALFError([{field: 'data.version', message: 'is required'}, {field: 'data.har', message: 'is required'}]),
  array: new ALFError([{field: 'data', message: 'has less items than allowed'}]),
  undef: new ALFError([{field: 'data.version', message: 'is required'}]),
  datasize: new ALFError([{
    field: 'data.har.log.entries.0.data.dataSize',
    message: 'is less than minimum'
  }]),
  properties: new ALFError([{
    field: 'data',
    message: 'has additional properties'
  }, {field: 'data.har.log.entries.0.request', message: 'has additional properties'}])
}

tap.test('v1.1.0-apiman', (t) => {
  t.test('failure', (assert) => {
    assert.plan(5)

    return Promise.all([
      validate({}, '1.1.0-apiman').catch((err) => assert.match(err, errors.object, 'should fail with empty object')),
      validate([], '1.1.0-apiman').catch((err) => assert.match(err, errors.array, 'should fail with empty array')),
      validate(undefined, '1.1.0-apiman').catch((err) => assert.match(err, errors.undef, 'should fail with undefined')),
      validate(fixtures.invalid.datasize, '1.1.0-apiman').catch((err) => assert.match(err, errors.datasize, 'should fail with bad "datasize"')),
      validate(fixtures.invalid.properties, '1.1.0-apiman').catch((err) => assert.match(err, errors.properties, 'should fail with additional properties"'))
    ])
  })

  t.test('success', (assert) => {
    assert.plan(4)

    return Promise.all([
      validate(fixtures.full, '1.1.0-apiman').then((out) => assert.equal(out, fixtures.full, 'should validate successfully with full example')),
      validate(fixtures.minimal, '1.1.0-apiman').then((out) => assert.equal(out, fixtures.minimal, 'should validate successfully with minimally required example')),
      validate(fixtures.multi, '1.1.0-apiman').then((out) => assert.equal(out, fixtures.multi, 'should succeed on multi ALF')),
      validate(fixtures.invalid.properties, '1.1.0-apiman', true).then((out) => assert.match(out, fixtures.minimal, 'should filter away additional properties'))
    ])
  })

    .then(t.end)
})
