import voucherRepository from "repositories/voucherRepository";
import voucherService from "../src/services/voucherService";

describe("test", () => {
    const voucher = {
        code: '11l',
        discount: 80
    }

    it("It should create a voucher", async () => {
        jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any => {});

        jest.spyOn(voucherRepository, "createVoucher").mockImplementationOnce(():any => {});

        await voucherService.createVoucher(voucher.code, voucher.discount);

        expect(voucherService.createVoucher).toBeCalled();
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
});