// License: LGPL-3.0-or-later
// based upon https://github.com/davidkalosi/js-money
import BigNumber from 'bignumber.js';

function assertSameCurrency(left: Money, right: Money) {
	if (left.currency !== right.currency)
		throw new TypeError('Different currencies');
}

function assertIsInteger(amount: BigNumber) {
	if (!amount.isInteger()) 
		throw new TypeError('Operand must be an integer');
}

export type MoneyAsJson = { cents: number, currency: string };

export enum RoundingMode {
	/** Rounds away from zero. */
	Up = 0,

	/** Rounds towards zero. */
	Down,

	/** Rounds towards Infinity. */
	Ceil,

	/** Rounds towards -Infinity. */
	Floor,

	/** Rounds towards nearest neighbour. If equidistant, rounds away from zero . */
	HalfUp,

	/** Rounds towards nearest neighbour. If equidistant, rounds towards zero. */
	HalfDown,

	/** Rounds towards nearest neighbour. If equidistant, rounds towards even neighbour. */
	HalfEven,

	/** Rounds towards nearest neighbour. If equidistant, rounds towards Infinity. */
	HalfCeil,

	/** Rounds towards nearest neighbour. If equidistant, rounds towards -Infinity. */
	HalfFloor,
}

/**
 * Represents a monetary amount. For safety, all Money objects are immutable. All of the functions in this class create a new Money object.
 *
 * Money always represents a whole number of the smallest monetary unit. It can never be fractional. Multiplication and division always rounds to
 * and integer (see the `RoundingMode` )
 *
 *
 * To create a new Money object is to use the `fromCents` function.
 * @export
 * @class Money
 */
export class Money {



	/**
	* Create a `Money` object with the given number if smallest monetary units and the ISO currency. Another name for the `fromCents` function.
	* @static
	* @memberof Money
	*/
	static fromSMU = Money.fromCents;

	/**
	 * The currency of the monetary value, always in lower case.
	 */
	readonly currency: string;

	protected constructor(readonly cents: number, currency: string) {
		this.currency = currency.toLowerCase();
		const methodsToBind = [this.equals, this.add, this.subtract, this.multiply, this.divide,
			this.compare, this.greaterThan, this.greaterThanOrEqual, this.lessThan,
			this.lessThanOrEqual, this.isZero, this.isPositive, this.isNegative,
			this.toJSON];
		methodsToBind.forEach((func) => Object.bind(func));

		Object.freeze(this);
	}

	/**
	 * Create a new money object
	 * @param amount a string containing the integer of the amount of the new Money object. If you pass a non-integer, `TypeError` will be thrown.
	 * @param currency the currency of the new Money object
	 */
	static fromCents(amount: BigNumber, currency?: string): Money {
		assertIsInteger(amount)
		return new Money(amount.toNumber(), currency);
	}

	/**
	* Adds the two objects together creating a new Money instance that holds the result of the operation.
	*
	* @param amount an object represented an integer value to add the current Money object.
	* The currency must match or `TypeError` will be thrown. If not, it must be an integer or `TypeError` is thrown.
	*/
	add(amount: Money): Money {
		const bigNumber = amount.toBigNumber();

		assertIsInteger(bigNumber)
		assertSameCurrency(this, amount);

		return new Money(this.toBigNumberWithNoDecimals().plus(bigNumber).toNumber(), this.currency);
	}

	/**
	* Compares another numerical value with this Money object.
	*
	* @param amount the numerical value to compare against this Money object.
	* The currencies must match or a `TypeError` is thrown.
	* @returns -1 if smaller than other, 0 if equal to other, 1 if greater than other.
	*/
	compare(amount: Money): number {
		const bigNumber = amount.toBigNumber();
		assertSameCurrency(this, amount);

		return this.toBigNumberWithNoDecimals().comparedTo(bigNumber);
	}

	/**
	 * Divides the object by the divisor returning a new Money instance that holds the result of the operation.
	 *
	 * @param divisor an object represented a numerical value to divide the current Money object by. If it's a Money object,
	 * the currency must match or `TypeError` will be thrown.
	 * @param roundingMode the rounding mode to use if the result of the division would otherwise lead to a non-integer Money value. By default,
	 * we use the `RoundingMode.HalfUp` mode.
	 */
	divide(divisor: Money, roundingMode: RoundingMode = RoundingMode.HalfUp): Money {
		const bigNumber = divisor.toBigNumber();

		assertSameCurrency(this, divisor);
		return new Money(this.toBigNumberWithNoDecimals(roundingMode).dividedBy(bigNumber).toNumber(), this.currency);
	}


	/**
	* Returns true if the two instances of Money are equal, false otherwise.
	*
	* @param amount an object represented a numerical value to compare to the current Money object to.
	* The currency must match for this to return true.
	*/
	equals(amount: Money): boolean {
		const bigNumber = amount.toBigNumber();
		
		return this.toBigNumberWithNoDecimals().isEqualTo(bigNumber) &&
			(amount instanceof Money ? this.currency === amount.currency : false);
	}

	/**
	* Checks whether the value represented by this object is greater than the other.
	*
	* @param amount an object represented a numerical value to compare to the current Money object to.
	* The currency must match or `TypeError` will be thrown.
	*/
	greaterThan(amount: Money): boolean {
		const bigNumber = amount.toBigNumber();

		assertSameCurrency(this, amount);
		return this.toBigNumberWithNoDecimals().isGreaterThan(bigNumber);
	}

	/**
	* Checks whether the value represented by this object is greater or equal to the other.
	*
	* @param amount an object represented a numerical value to compare to the current Money object to. If `other`
	* The currency must match or `TypeError` will be thrown.
	*/
	greaterThanOrEqual(amount: Money): boolean {
		const bigNumber = amount.toBigNumber();

		assertSameCurrency(this, amount);
		return this.toBigNumberWithNoDecimals().isGreaterThanOrEqualTo(bigNumber);
	}

	/**
	 * Returns true if the amount is negative
	 *
	 */
	isNegative(): boolean {
		return this.toBigNumberWithNoDecimals().isNegative();
	}

	/**
	* Returns true if the amount is positive.
	*
	*/
	isPositive(): boolean {
		return this.toBigNumberWithNoDecimals().isPositive();
	}

	/**
	* Returns true if the amount is zero.
	*/
	isZero(): boolean {
		return this.toBigNumberWithNoDecimals().isZero();
	}

	/**
	* Checks whether the value represented by this object is less than the other.
	*
	* @param amount an object represented a numerical value to compare to the current Money object to.
	* The currency must match or `TypeError` will be thrown.
	*/
	lessThan(amount: Money): boolean {
		const bigNumber = amount.toBigNumber();

		assertSameCurrency(this, amount);
		return this.toBigNumberWithNoDecimals().isLessThan(bigNumber);
	}

	/**
	* Checks whether the value represented by this object is less than or equal to the other.
	*
	* @param amount an object represented a numerical value to compare to the current Money object to.
	* The currency must match or `TypeError` will be thrown.
	*/
	lessThanOrEqual(amount: Money): boolean {
		const bigNumber = amount.toBigNumber();

		assertSameCurrency(this, amount);
		return this.toBigNumberWithNoDecimals().isLessThanOrEqualTo(bigNumber);
	}

	/**
	 * Multiplies the object by the multiplier returning a new Money instance that holds the result of the operation.
	 *
	 * @param multiplier an object represented a numerical value to multiply the current Money object by. If it's a Money object,
	 * the currency must match or `TypeError` will be thrown.
	 * @param roundingMode the rounding mode to use if the result of the multiplication would otherwise lead to a non-integer Money value. By default,
	 * we use the `RoundingMode.HalfUp` mode.
	 */
	multiply(multiplier: Money, roundingMode: RoundingMode = RoundingMode.HalfUp): Money {
		const bigNumber = multiplier.toBigNumber();
		assertSameCurrency(this, multiplier);

		const unrounded = this.toBigNumberWithNoDecimals(roundingMode).multipliedBy(bigNumber);

		return new Money(unrounded.decimalPlaces(0, roundingMode).toNumber(), this.currency);
	}

	/**
	 * Subtracts the two objects creating a new Money instance that holds the result of the operation.
	 *
	 * @param other an object represented an integer value to subtract from the current Money object. If it's a Money object,
	 * the currency must match or `TypeError` will be thrown. If not, it must be an integer or `TypeError` is thrown.
	 */
	subtract(amount: Money): Money {
		const bigNumber = amount.toBigNumber();

		assertSameCurrency(this, amount);
		assertIsInteger(bigNumber)
		return new Money(this.toBigNumberWithNoDecimals().minus(bigNumber).toNumber(), this.currency);
	}

	/**
	 * Get the amount of the Money instance as a `BigNumber`.
	 */
	toBigNumber() : BigNumber {
		return new BigNumber(this.cents);
	}

	/**
	* Returns a serialized version of the instance.
	*
	* @returns {{amount: number, currency: string}}
	*/
	toJSON(): MoneyAsJson {
		return {
			cents: this.cents,
			currency: this.currency,
		};
	}

	private toBigNumberWithNoDecimals(roundingMode?:RoundingMode) : BigNumber {
		const config:BigNumber.Config = {
			DECIMAL_PLACES: 0,
		};

		if (roundingMode) {
			config.ROUNDING_MODE = roundingMode;
		}

		return  new (BigNumber.clone(config))(this.toBigNumber());
	}
}