export function removeVietnameseAccents(str) {
    return str
        .normalize('NFD') // Chuyển hóa chuỗi về dạng tách hợp
        .replace(/[\u0300-\u036f]/g, '') // Loại bỏ các dấu tách hợp
        .replace(/đ/g, 'd') // Chuyển đổi 'đ' thành 'd'
        .replace(/Đ/g, 'D'); // Chuyển đổi 'Đ' thành 'D'
}