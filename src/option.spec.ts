import { None, Some } from './option';

describe('Option', () => {
  describe('Some', () => {
    const value = 'value';
    const valueb = 'something else!';
    const option = Some(value);
    const optionb = Some(valueb);

    it('isSome should be true', () => {
      expect(option.isSome()).toBe(true);
    });

    it('isNone should be false', () => {
      expect(option.isNone()).toBe(false);
    });

    it('can map a value', () => {
      const val2 = 'something else';
      const map = (val: string): string => {
        expect(val).toEqual(value);
        return val2;
      };
      expect(option.map(map).unwrap()).toBe(val2);
    });

    it('can unwrap value', () => {
      expect(option.unwrap()).toEqual(value);
    });

    it('unwrapOr returns original value', () => {
      expect(option.unwrapOr('something else')).toEqual(value);
    });

    it('andThen can chain options', () => {
      expect(option.andThen(val => Some({ val })).unwrap()).toEqual({ val: value });
      expect(option.andThen(() => None()).isSome()).toEqual(false);
    });

    it('can filter properly', () => {
      expect(option.filter(val => val === '').isSome()).toEqual(false);
      expect(option.filter(val => val === value).isSome()).toEqual(true);
    });

    it('returns self instead of optionb on or', () => {
      expect(option.or(optionb).unwrap()).toEqual(value);
    });

    it('returns optionb on and', () => {
      expect(option.and(optionb).unwrap()).toEqual(valueb);
    });

    it('converts to Ok with value', () => {
      const result = option.okOr(new Error('Fail'));
      expect(result.isOk()).toEqual(true);
      expect(result.unwrap()).toEqual(value);
    });
  });

  describe('None', () => {
    const value = 'value';
    const option = None();
    const optionb = Some(value);

    const throwingFn = (): never => {
      throw new Error("Shouldn't call this");
    };
    it('isSome should be false', () => {
      expect(option.isSome()).toBe(false);
    });

    it('isNone should be true', () => {
      expect(option.isNone()).toBe(true);
    });

    it('wont map a none', () => {
      expect(option.map(throwingFn).isNone()).toBe(true);
    });

    it('throw on unwrap', () => {
      expect(() => option.unwrap()).toThrowError('Tried to unwrap a None!');
    });

    it('unwrapOr returns or value', () => {
      expect(option.unwrapOr(value)).toEqual(value);
    });

    it('andThen wont chain on a none', () => {
      expect(option.andThen(throwingFn).isNone()).toEqual(true);
    });

    it('filter always returns none', () => {
      expect(option.filter(throwingFn).isNone()).toEqual(true);
    });

    it('returns optionb on or', () => {
      expect(option.or(optionb).unwrap()).toEqual(value);
    });

    it('returns optionb on and', () => {
      expect(option.and(optionb).isNone()).toEqual(true);
    });

    it('converts to Err on okOr', () => {
      const error = new Error('Fail');
      const result = option.okOr(error);
      expect(result.isErr()).toEqual(true);
      expect(result.unwrapErr()).toEqual(error);
    });
  });
});
