import voucherRepository from "repositories/voucherRepository";
import voucherService from "../src/services/voucherService";

describe("test", () => {
    const voucher = {
        code: '11l',
        discount: 80
    }

    it("It should create a voucher", async () => {
        jest.spyOn(voucherRepository, "getVoucherByCode")
            .mockImplementationOnce((): any => { });

        jest.spyOn(voucherRepository, "createVoucher")
            .mockImplementationOnce((): any => { });

        await voucherService.createVoucher(voucher.code, voucher.discount);

        expect(voucherRepository.createVoucher).toBeCalled();
    });

    it("It shouldn't create an exist voucher", async () => {
        jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any => {
            return voucher;
        });

        try {
            await voucherService.createVoucher(voucher.code, voucher.discount);
        } catch (e) {
            expect(e.message).toMatch("Voucher already exist.");
        }
    });


    it("should apply a valid voucher", async () => {
        jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any => {
            return {
                ...voucher,
                id: 1,
                used: false
            };
        });

        jest.spyOn(voucherRepository, "useVoucher").mockImplementationOnce((): any => { });

        const amount = 1000;
        const order = await voucherService.applyVoucher(voucher.code, amount);
        expect(order.amount).toBe(amount);
        expect(order.discount).toBe(voucher.discount);
        expect(order.finalAmount).toBe(amount - amount * (voucher.discount / 100));
        expect(order.applied).toBe(true);
    });

    it("should not apply discount for values below 100", async () => {
        jest
            .spyOn(voucherRepository, "getVoucherByCode")
            .mockImplementationOnce((): any => {
                return {
                    id: 1,
                    code: voucher.code,
                    discount: voucher.discount,
                    used: false,
                };
            });

        const amount = 99;
        const order = await voucherService.applyVoucher(voucher.code, amount);

        expect(order.amount).toBe(amount);
        expect(order.discount).toBe(voucher.discount);
        expect(order.finalAmount).toBe(amount);
        expect(order.applied).toBe(false);
    });

    it("should not apply discount for used voucher", async () => {
        jest
            .spyOn(voucherRepository, "getVoucherByCode")
            .mockImplementationOnce((): any => {
                return {
                    id: 1,
                    code: voucher.code,
                    discount: voucher.discount,
                    used: true,
                };
            });

        const amount = 1000;
        const order = await voucherService.applyVoucher(voucher.code, amount);

        expect(order.amount).toBe(amount);
        expect(order.discount).toBe(voucher.discount);
        expect(order.finalAmount).toBe(amount);
        expect(order.applied).toBe(false);
    });

    it("should not apply discount for invalid valucher", (): any => { });
});