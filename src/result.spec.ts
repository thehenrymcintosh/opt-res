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

    it('can map', () => {
      const resolved = result
        .map(val => `${val}-a`);
      expect(resolved.unwrap()).toEqual(`${value}-a`);
    });

    it('maps errors', () => {
      const resolved = result
        .mapErr(throwingFn);
      expect(resolved.unwrap()).toEqual(value);
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

    it('never containsErr', () => {
      expect(result.containsErr(new Error('anything'))).toEqual(false);
    });

    it('flattens a layer with each call', () => {
      const val = 'flattened!';
      const result1 = Ok(Ok(val));
      const resultErr = Ok(Err(val));
      expect(result1.flatten().flatten().unwrap()).toEqual(val);
      expect(resultErr.flatten().unwrapErr()).toEqual(val);
    });

    it('Can unwrap or else', () => {
      const output = Ok(value).unwrapOrElse(throwingFn);
      expect(output).toEqual(value);
    });

    it('iter contains value', () => {
      const arr = Ok(value).iter();
      expect(arr).toHaveLength(1);
      expect(arr[0]).toEqual(value);
    });

    it('or returns current result', () => {
      const result = Ok(value).or(Ok('something else'));
      expect(result.unwrap()).toEqual(value);
    });

    it('orElse returns current result', () => {
      const result = Ok<string, string>(value).orElse((val) => Ok(`${val}-a`));
      expect(result.unwrap()).toEqual(value);
    });

    it('and returns passed result', () => {
      const result = Ok('random').and(Ok(value));
      expect(result.unwrap()).toEqual(value);
    });
  });

  describe('Err', () => {
    const value = 'value';
    const message = 'The princess is in another castle!';
    const error = new Error(message);
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

    it('wont map', () => {
      const resolved = result
        .map(val => `${val}-a`);
      expect(resolved.unwrapErr()).toEqual(error);
    });

    it('maps errors', () => {
      const resolved = result
        .mapErr(err => `${err.message}-a`);
      expect(resolved.unwrapErr()).toEqual(`${message}-a`);
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

    it('strict equal containsErr', () => {
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

    it('Can unwrap or else', () => {
      const output = Err(value).unwrapOrElse((val) => `${val}-a`);
      expect(output).toEqual(`${value}-a`);
    });

    it('iter is empty', () => {
      expect(Err(value).iter()).toHaveLength(0);
    });

    it('or returns passed result', () => {
      const result = Err(error).or(Ok(value));
      expect(result.unwrap()).toEqual(value);
    });

    it('orElse calls mapped result', () => {
      const result = Err(value).orElse((val) => Ok(`${val}-a`));
      expect(result.unwrap()).toEqual(`${value}-a`);
    });

    it('and returns error', () => {
      const result = Err(value).and(Ok('random'));
      expect(result.unwrapErr()).toEqual(value);
    });
  });
});
