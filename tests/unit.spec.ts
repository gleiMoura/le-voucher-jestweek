import voucherRepository from "repositories/voucherRepository";
import createVoucher from "../src/services/voucherService";

describe("test", () => {
    const voucher = {
        code: '11l',
        discount: 80
    }

    it("It should create a voucher", async () => {
        jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce(() => {
            return null
        });

        jest.spyOn(voucherRepository, "createVoucher").mockImplementationOnce(() => {
            return null
        });

        const result = await createVoucher.createVoucher(voucher.code, voucher.discount);


        expect(result).toEqual(undefined)
    });

    it("It shouldn't create an exist voucher", async () => {
        jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any => {
            return voucher;
        });

        try {
            await createVoucher.createVoucher(voucher.code, voucher.discount);
        } catch (e) {
            expect(e.message).toMatch("Voucher already exist.");
        }
    });

    it("should apply a valid voucher", async () => {
        const minAmount = 101;
        const finalAmount = minAmount - minAmount * (voucher.discount / 100);
        const expectedResponse = {
            amount: minAmount,
            discount: voucher.discount,
            finalAmount,
            applied: finalAmount !== minAmount,
        };

        jest
            .spyOn(voucherRepository, "getVoucherByCode")
            .mockImplementationOnce((): any => {
                return { code: voucher.code, used: false };
            });

        jest
            .spyOn(voucherRepository, "useVoucher")
            .mockImplementationOnce((): any => {
                return voucher.code;
            });

        const response = await createVoucher.applyVoucher(voucher.code, minAmount);
        expect(response).toEqual(expectedResponse);
    });
});