const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    let validator;

    beforeEach(() => {
      validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
        age: {
          type: 'number',
          min: 18,
          max: 27,
        },
      });
    });

    afterEach(() => {
      validator = undefined;
    });

    it('валидатор проверяет min длинну строковых полей', () => {
      const errors = validator.validate({name: 'Lalala'});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
    });

    it('валидатор проверяет min длинну цифровых полей', () => {
      const errors = validator.validate({age: 17});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 18, got 17');
    });

    it('валидатор проверяет тип имени и останавливает проверку', () => {
      const errors = validator.validate({name: 1, age: 'Hi'});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect string, got number');
    });

    it('валидатор проверяет тип возраста и останавливает проверку', () => {
      const errors = validator.validate({age: 'Hi', name: 1});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got string');
    });

    it('валидатор проверяет тип max длиннну обоих полей', () => {
      const errors = validator.validate(
        {name: 'oneTwoThreeFourFiveSixSevenEightNineEleven', age: 100},
      );
      expect(errors).to.have.length(2);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 20, got 42');
      expect(errors[1]).to.have.property('field').and.to.be.equal('age');
      expect(errors[1]).to.have.property('error').and.to.be.equal('too big, expect 27, got 100');
    });

    it('валидатор отдает пустой массив при правильном вводе значений', () => {
      const errors = validator.validate({name: 'Daria Alekseevna', age: 23});

      expect(errors).to.have.length(0);
    });

    it('валидатор отдает пустой массив при отсутвии значений', () => {
      const errors = validator.validate();

      expect(errors).to.have.length(0);
    });

    it('валидатор отдает пустой массив при передаче неактыальных поелй', () => {
      const errors = validator.validate({unsuitableField: 'Привет'});

      expect(errors).to.have.length(0);
    });
  });
});
