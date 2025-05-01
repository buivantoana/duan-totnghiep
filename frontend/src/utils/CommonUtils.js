import * as XLSX from 'xlsx/xlsx.mjs'
import { PREFIX_CURRENCY } from '../utils/constant'

class CommonUtils {
    static getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    static exportExcel(data, nameSheet, nameFile) {
        return new Promise((resolve, reject) => {
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(data);
            XLSX.utils.book_append_sheet(wb, ws, nameSheet);
            XLSX.writeFile(wb, `${nameFile}.xlsx`);
            resolve('oke');
        });
    }

    static #rawFormatter = new Intl.NumberFormat('en-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: PREFIX_CURRENCY.minimumFractionDigits
    });

    static formatter = {
        format(value) {
            const formatted = CommonUtils.#rawFormatter.format(value);
            // Đưa ₫ ra sau nếu cần
            return formatted.replace('₫', '').trim() + ' ₫';
        }
    }
}

export default CommonUtils;
