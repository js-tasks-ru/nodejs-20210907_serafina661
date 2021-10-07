module.exports = class Validator {
  constructor(rules) {
    this.rules = rules;
  }

  validate(obj) {
    const errors = [];
    if (obj) {
      const valuesForCheckArray = Object.keys(obj);
      if (valuesForCheckArray.length) {
        for (const field of valuesForCheckArray) {
          const rules = this.rules[field];

          const value = obj[field];
          const type = typeof value;

          if (this.rules[field]) {
            if (rules.type && type !== rules.type) {
              errors.push({field, error: `expect ${rules.type}, got ${type}`});
              return errors;
            }

            switch (field) {
              case 'name':
                if (value.length < rules.min) {
                  errors.push(
                    {field, error: `too short, expect ${rules.min}, got ${value.length}`},
                  );
                }
                if (value.length > rules.max) {
                  errors.push({field, error: `too long, expect ${rules.max}, got ${value.length}`});
                }
                break;
              case 'age':
                if (value < rules.min) {
                  errors.push({field, error: `too little, expect ${rules.min}, got ${value}`});
                }
                if (value > rules.max) {
                  errors.push({field, error: `too big, expect ${rules.max}, got ${value}`});
                }
                break;
            }
          }
        }
      }
    }

    return errors;
  }
};
