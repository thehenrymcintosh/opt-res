import { Err, Ok } from './result';
const throwingFn = (): never => {
  throw new Error("Shouldn't call this");
};

describe('Result', () => {
  describe('Ok', () => {
    const value = 'value';
    const val2 = 'something else';
    const result = Ok<Error, string>(value);

    it('is not err', () => {
      expect(result.isErr()).toEqual(false);
    });

    it('is ok', () => {
      expect(result.isOk()).toEqual(true);
    });

    it('ok casts to some', () => {
      expect(result.ok().unwrap()).toEqual(value);
      expect(result.ok().isSome()).toEqual(true);
    });

    it('err casts to none', () => {
      expect(result.err().isNone()).toEqual(true);
    });

    it('can unwrap', () => {
      expect(result.unwrap()).toEqual(value);
    });

    it('unwrapOr returns internal value', () => {
      expect(result.unwrapOr('something else')).toEqual(value);
    });

    it('unwrapErr throws', () => {
      expect(() => result.unwrapErr()).toThrowError('Tried to unwrapErr an Ok!');
    });

    it('can map sync or async', () => {
      const resolved = result
        .map(val => `${val}-a`);
      expect(resolved.unwrap()).toEqual(`${value}-a`);
    });

    it('can chain andThens sync or async', () => {
      const resolved = result
        .andThen(val => Ok(`${val}-a`));
      expect(resolved.unwrap()).toEqual(`${value}-a`);
    });

    it('can reduce', () => {
      const map = (val: string): string => {
        expect(val).toEqual(value);
        return val2;
      };
      expect(result.reduce(throwingFn, map)).toEqual(val2);
    });

    it('strict equal contains', () => {
      expect(result.contains(value)).toEqual(true);
      expect(result.contains('something else')).toEqual(false);
    });

    it('strict equal contains', () => {
      expect(result.containsErr(new Error('anything'))).toEqual(false);
    });

    it('flattens a layer with each call', () => {
      const val = 'flattened!';
      const result1 = Ok(Ok(val));
      const resultErr = Ok(Err(val));
      expect(result1.flatten().unwrap()).toEqual(val);
      expect(resultErr.flatten().unwrapErr()).toEqual(val);
    });
  });

  describe('Err', () => {
    const value = 'value';
    const error = new Error('The princess is in another castle!');
    const result = Err<Error, string>(error);

    it('is err', () => {
      expect(result.isErr()).toEqual(true);
    });

    it('is not ok', () => {
      expect(result.isOk()).toEqual(false);
    });

    it('ok casts to none', () => {
      expect(result.ok().isNone()).toEqual(true);
    });

    it('err casts to some', () => {
      expect(result.err().isSome()).toEqual(true);
      expect(result.err().unwrap()).toEqual(error);
    });

    it('cant unwrap', () => {
      expect(() => result.unwrap()).toThrowError('Tried to unwrap an Err!');
    });

    it('unwrapOr returns or value', () => {
      expect(result.unwrapOr(value)).toEqual(value);
    });

    it('unwrapErr returns error', () => {
      expect(result.unwrapErr()).toEqual(error);
    });

    it('wont map sync or async', () => {
      const resolved = result
        .map(val => `${val}-a`);
      expect(resolved.unwrapErr()).toEqual(error);
    });

    it('wont chain andThens sync or async', () => {
      const resolved = result
        .andThen(val => Ok(`${val}-a`));
      expect(resolved.unwrapErr()).toEqual(error);
    });

    it('can reduce', () => {
      const map = (err: Error): string => {
        expect(err).toEqual(error);
        return value;
      };
      expect(result.reduce(map, throwingFn)).toEqual(value);
    });

    it('never contains', () => {
      expect(result.contains(value)).toEqual(false);
    });

    it('never contains', () => {
      expect(result.containsErr(error)).toEqual(true);
      expect(result.containsErr(new Error('something else'))).toEqual(false);
    });

    it('doesnt flatten the error side', () => {
      const val = 'flattened!';
      const result1 = Err(Ok(val));
      const resultErr = Err(Err(val));
      expect(result1.flatten().isErr()).toEqual(true);
      expect(resultErr.flatten().isErr()).toEqual(true);
    });
  });
});
