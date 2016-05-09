import Validator from '../../libs/validator';
import Schema from '../../libs/schema';
import TypeValidator from '../../libs/types/validator';

import { types, fieldTypes } from '../data';
import { isObject } from '../../libs/primitives';

import should from 'should';
import expect from 'expect.js';

describe('Setting a schema', () => {
  it('Should accept creating an empty schema', (done) => {
    let schema = new Schema();
    should(() => {
      schema.setSchema({});
    })
    .not.throw(Error);
    done();
  });

  it('Should accept creating a flat schema', (done) => {
    let schema = new Schema();
    should(() => {
      schema.setSchema({
        name: String
      });
    })
    .not.throw(Error);

    expect(schema.structure.name).to.exist;
    done();
  });

  it('Should expand the constructor based schema key', (done) => {
    let schema = new Schema();
    schema.setSchema({
      name: String
    });
    expect(schema.structure.name.type).to.be('string');
    done();
  });

  it('Should typecast Array into schema', (done) => {
    let schema = new Schema();
    schema.setSchema({
      types: []
    });
    expect(schema.structure.types.type).to.be('array');
    expect(schema.structure.types).to.have.keys('children');
    done();
  });

  it('Should typecast Array with defined children into a schema', (done) => {
    let schema = new Schema();
    schema.setSchema({
      types: [String]
    });
    expect(schema.structure.types.type).to.be('array');
    expect(schema.structure.types).to.have.keys('children');
    expect(schema.structure.types.children).to.be.an('object');
    expect(schema.structure.types.children.type).to.be('string');
    done();
  });

  let types = Object.keys(Validator);
  types = [types[0]];
  types.map((fieldType) => {
    // Skip non-validator field types
    if (!(Validator[fieldType].prototype instanceof TypeValidator)) {
      return;
    }

    it(`should give the same output for string based input as well as constructor based for "${fieldType}"`, (done) => {
      let schema = new Schema();
      schema.setSchema({
        p: fieldType
      })
      let s1 = Object.assign({}, schema.structure);

      schema.setSchema({
        p: Validator[fieldType].fieldType
      })
      let s2 = Object.assign({}, schema.structure);
      expect(s1).to.eql(s2);
      done();
    });
  });

  it('should have an Array with "string" providing the same results as an Array with String', (done) => {
    let schema = new Schema();
    schema.setSchema({
      types: ['string']
    });
    let s1 = Object.assign({}, schema.structure);

    schema.setSchema({
      types: [String]
    });
    let s2 = Object.assign({}, schema.structure);
    expect(s1).to.eql(s2);
    done();
  });

  it('Should typecast object with children to a schema', (done) => {
    let schema = new Schema();
    schema.setSchema({
      p1: {
        p2: {
          p3: String
        }
      }
    });
    expect(schema.structure.p1).to.be.a(Schema);
    expect(schema.structure.p1.structure.p2).to.be.a(Schema);
    expect(schema.structure.p1.structure.p2.structure.p3).not.to.be.a(Schema);
    done();
  });
});