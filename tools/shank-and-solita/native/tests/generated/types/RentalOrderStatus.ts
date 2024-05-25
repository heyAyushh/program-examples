/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from "@metaplex-foundation/beet";
/**
 * @category enums
 * @category generated
 */
export enum RentalOrderStatus {
	Created = 0,
	PickedUp = 1,
	Returned = 2,
}

/**
 * @category userTypes
 * @category generated
 */
export const rentalOrderStatusBeet = beet.fixedScalarEnum(
	RentalOrderStatus,
) as beet.FixedSizeBeet<RentalOrderStatus, RentalOrderStatus>;
