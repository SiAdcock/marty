var expect = require('chai').expect;
var Marty = require('../../../index');
var warnings = require('../../../warnings');
var describeStaticAndClass = require('../lib/describeStaticAndClass');

describeStaticAndClass('SessionStorageStateSource', function () {
  var source;
  var factory = this.factory;

  beforeEach(function () {
    warnings.classDoesNotHaveAnId = false;
    sessionStorage.clear();
    source = factory({
      classic: function () {
        return Marty.createStateSource({
          type: 'sessionStorage'
        });
      },
      es6: function () {
        class SessionStorage extends Marty.SessionStorageStateSource {
        }

        return new SessionStorage();
      }
    });
  });

  afterEach(function () {
    warnings.classDoesNotHaveAnId = true;
  });

  describe('#createRepository()', function () {
    it('should expose get and set methods', function () {
      expect(source).to.have.property('get');
      expect(source).to.have.property('set');
    });
  });

  describe('#set()', function () {
    beforeEach(function () {
      source.set('foo', 'bar');
    });

    it('should store data under key in sessionStorage', function () {
      expect(sessionStorage.getItem('foo')).to.equal('bar');
    });
  });

  describe('#get()', function () {
    beforeEach(function () {
      sessionStorage.setItem('foo', 'bar');
    });

    it('should retrieve data under key in sessionStorage', function () {
      expect(source.get('foo')).to.equal('bar');
    });
  });

  describe('#namespace', function () {
    beforeEach(function () {
      source = factory({
        classic: function () {
          return Marty.createStateSource({
            namespace: 'baz',
            type: 'sessionStorage'
          });
        },
        es6: function () {
          class SessionStorage extends Marty.SessionStorageStateSource {
            get namespace() {
              return 'baz';
            }
          }

          return new SessionStorage();
        }
      });
    });

    describe('when you pass in a namespace', function () {
      describe('when retrieving data', function () {
        beforeEach(function () {
          sessionStorage.setItem('bazfoo', 'bar');
        });

        it('should prepend namespace to key', function () {
          expect(source.get('foo')).to.equal('bar');
        });
      });

      describe('when storing data', function () {
        beforeEach(function () {
          source.set('foo', 'bar');
        });

        it('should prepend namespace to key', function () {
          expect(sessionStorage.getItem('bazfoo')).to.equal('bar');
        });
      });
    });
  });

});