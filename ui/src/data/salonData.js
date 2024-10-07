import bacninh_1 from '../assets/imageHome/Salon/88_BacNinh.jpg'
import bacninh_2 from '../assets/imageHome/Salon/201_BacNinh.jpg'
import dongnai_1 from '../assets/imageHome/Salon/DongNai1.jpg'
import dongnai_2 from '../assets/imageHome/Salon/DongNai2.jpg'
import dongnai_3 from '../assets/imageHome/Salon/DongNai3.jpg'
import dongnai_4 from '../assets/imageHome/Salon/DongNai4.jpg'
import hainoi_1 from '../assets/imageHome/Salon/HaNoi1.jpg'
import salon1 from '../assets/imageHome/Salon/HCM1.jpg'
import danang_1 from '../assets/imageHome/Salon/DaNang1.jpg'

export const salonData = {
    "Bắc Ninh": [
      {
        id: 1,
        address: "386 Ngô Gia Tự, Phường 2, Tp Bắc Ninh, Bắc Ninh",
        description: "Đối diện khách sạn Mường Thanh Bắc Ninh, cạnh ngã 3 của đường Ngô Gia Tự và đường Võ Kiều",
        image: bacninh_1
      },
      {
        id: 2,
        address: "Số 4 Lê Quang Đạo, Đồng Ngân, Từ Sơn, Bắc Ninh",
        description: "Số 4 Lê Quang Đạo - cách chợ Giầu 100m về phía công viên Lý Thái Tổ, ngay tại ngã 4 giao nhau giữa LQĐ và Chợ Tre",
        image: bacninh_2
      }
    ],

    "Đồng Nai": [
        {
            id: 1,
            address: "135 Lê Duẩn, Thị Trấn Long Thành, Long Thành, Đồng Nai",
            description: "Khu nhà Mơ Ước, Đối diện Công Viên 3A (Cách Yody 20m)",
            image: dongnai_1
        },
        {
            id: 2,
            address: "1371 Phạm Văn Thuận, Phường Thống Nhất, TP Biên Hòa, Tỉnh Đồng Nai",
            description: "Sát cầu Mương Sao, đối diện tòa nhà NK building và phòng Cảnh Sát Giao Thông tỉnh Đồng Nai",
            image: dongnai_2
        },
        {
            id: 3,
            address: "20 Đường 30T4, phường Trung Dũng, TP Biên Hòa, Đồng Nai",
            description: "Đối diện là Trường THPT Ngô Quyền, kế bên salon là KFC Ba Mươi Tháng Tư",
            image: dongnai_3
        },
        {
            id: 4,
            address: "451 Phạm Văn Thuận, P. Tam Hiệp, TP. Biên Hòa, Đồng Nai",
            description: "Cách vòng xoay Tam Hiệp 2km , theo đường Phạm Văn Thuận",
            image: dongnai_4
        }

    ],
    "Hà Nội": [
        {
            id: 1,
            address: "10 Trần Phú, P. Mộ Lao, Q. Hà Đông, Hà Nội",
            description: "Số 10 Trần Phú - Gần toà nhà MacPlaza. Cách hầm chui Nguyễn Trãi 700m hướng về phía Hà Đông",
            image: hainoi_1
        },
        {
            id: 2,
            address: "104 Cửa Bắc, P. Quán Thánh, Q. Ba Đình,TP Hà Nội",
            description: "Đối diện Trường THPT Phan Đình Phùng",
            image: hainoi_1
        },
        {
            id: 3,
            address: "14 Lĩnh Nam, P. Mai Động, Q. Hoàng Mai, TP Hà Nội",
            description: "Ngay đầu Lĩnh Nam, cách cầu Mai Động 500m",
            image: hainoi_1
        },
        {
            id: 4,
            address: "150 Cầu Bươu, P. Tân Triều, Q. Thanh Trì, TP Hà Nội",
            description: "Cách viên K Tân Triều 200m",
            image: hainoi_1
        }
    ],
    "Hồ Chí Minh": [
        {
            id: 1,
            address: "1146 Kha Vạn Cân, Phường Linh Chiểu, Quận Thủ Đức, TP HCM",
            description: "Đối diện ngân hàng Agribank, gần ngã 3 nối Hoàng Diệu. Đường Phạm Văn Đồng chạy vào khoảng 500m",
            image: salon1
        },
        {
            id: 2,
            address: "170 Nơ Trang Long, Phường 12, Quận Bình Thạnh, TP HCM",
            description: "Đối diện trạm xăng dầu số 8",
            image: salon1
        },
        {
            id: 3,
            address: "145 Tô Hiến Thành, Phường 13, Quận 10, TP HCM",
            description: "145 Tô Hiến Thành - Cuối đường Hồ Bá Kiện, từ Cách mạng tháng 8 rẽ vào Tô Hiến Thánh khoảng 350m, đi qua nhà thờ Hòa Hưng khoảng 100m nhìn bên trái sẽ thấy salon nằm ngay ngã 3 Hồ Bá Kiện, Tô Hiến Thành",
            image: salon1
        },
        {
            id: 4,
            address: "177 Đặng Văn Bi, Phường Bình Thọ, Q.Thủ Đức, HCM",
            description: "Gẫn ngã tư Võ Văn Ngân, Đăng Văn Bi. Cách XLHN 500m",
            image: salon1
        }
    ],

    "Bình Dương": [
        {
            id: 1,
            address: "255 Nguyễn An Ninh, P. Dĩ An, Dĩ An, Bình Dương",
            description: "Cách Điện Máy Xanh 200m, nằm cạnh Viettel Store",
            image: salon1
        },
        {
            id: 2,
            address: "36 đường N1, KCN Mỹ Phước 1, Phường Thới Hòa, Bến Cát, Bình Dương",
            description: "Đối diện DMX đường N1, quốc lộ 14 vẹo vào 500m",
            image: salon1
        }
    ],

    "Đà Nẵng": [
        {
            id: 1,
            address: "130 Xô Viết Nghệ Tĩnh, Phường Hòa Cường Nam, Quận Hải Châu, Đà Nẵng",
            description: "Đi từ hướng cầu Hòa Xuân qua ngã tư lê thanh nghị rẽ trái vào XVNT. Đối diện bảo hiểm xã hội thành phố",
            image: danang_1
        },
        {
            id: 2,
            address: "345 Nguyễn Văn Linh, P. Thạc Gián, Quận Thanh Khê, Đà Nẵng",
            description: "Đối diện ngân hàng Techcombank, cách ngã 3 Nguyễn Văn Linh - Nguyễn Tri Phương 800m",
            image: danang_1
        }
    ],

    "Hải Phòng": [
        {
            id: 1,
            address: "278 Trần Nguyên Hãn, P. Niệm Nghĩa, Quận Lê Chân, Hải Phòng",
            description: "Bên cạnh ngân hàng OCB, đối diện Điện Máy Xanh, đối diện HeyU, chéo góc phải bến xe Niệm Nghĩa",
            image: salon1
        },
        {
            id: 2,
            address: "205 Lạch Tray, phường Đông Khê, quận Ngô Quyền, TP Hải Phòng",
            description: "Hướng Từ chung cư Hoàng Huy đi lên 200m. Hướng từ Ngã Tư Đình Đông-An Đà đi lên Cầu Lạch Tray 200m",
            image: salon1
        }
    ],

    "Cần Thơ": [
        {
            id: 1,
            address: "205 Đường 30/4, P. Xuân Khánh, Quận Ninh Kiều, Cần Thơ",
            description: "Cách toà nhà Sheraton 500m( Vincom Xuân Khánh cũ). Cách chợ Xuân Khánh 100m",
            image: salon1
        },
        {
            id: 2,
            address: "135 Trần Hưng Đạo, Phường An Phú, Quận Ninh Kiều, Cần Thơ",
            description: "Bên canh ngân hàng Bản Việt. Cách ngã tư mậu thân- trần hưng đạo chỉ 50m",
            image: salon1
        }
    ],

    "An Giang": [
        {
            id: 1,
            address: "113 Trần Hưng Đạo, P. Mỹ Bình, Long Xuyên, An Giang",
            description: "Nằm trên đường Trần Hưng Đạo đối diện khách sạn Hòa Bình và sân vận động",
            image: salon1
        }
    ],

    "Vũng Tàu": [
        {
            id: 1,
            address: "294 Lê Hồng Phong, Phường 4, TP. Vũng Tàu, Vũng Tàu",
            description: "Ngay ngã 5 Vũng Tàu, cạnh Highland Coffee",
            image: salon1
        }
    ],

    "Khánh Hòa": [
        {
            id: 1,
            address: "152 Thống Nhất, P. Phương Sài, TP. Nha Trang, Khánh Hòa",
            description: "Salon nằm ngay ngã tư Thống Nhất - Lê Thành Phương. Cách vòng xoay tượng đài 300m",
            image: salon1
        }
    ],

    "Thanh Hóa": [
        {
            id: 1,
            address: "304 Nguyễn Trãi, phường Tân Sơn, TP Thanh Hóa",
            description: "Cách chợ Tây Thành 100m đi về hướng bến xe phía Tây",
            image: salon1
        },
        {
            id: 2,
            address: "290 Quang Trung, phường Đông Vệ, TP Thanh Hóa",
            description: "Đối diện chợ Nam Thành",
            image: salon1
        },
        {
            id: 3,
            address: "19 Trần Phú, P. Điện Biên, TP. Thanh Hóa, Thanh Hóa",
            description: "Salon nằm cách ngã tư tượng đài Lê Lợi 100m về hướng Công an thành phố Thanh Hóa",
            image: salon1
        }
    ],

    "Hà Tĩnh": [
        {
            id: 1,
            address: "99 Trần Phú, Phường Trần Phú, TP Hà Tĩnh",
            description: "Cạnh xe máy điện Vinfat 3S, đối diện Đại Lý xe máy Honda Phú Tài Đức 3",
            image: salon1
        }
    ],

    "Đắk Lắk": [
        {
            id: 1,
            address: "147 Lê Hồng Phong, P. Thống Nhất, TP Buôn Ma Thuột, Đắk Lắc",
            description: "Ngã 3 Nơ Trang Lòng với Lê Hồng Phong, đi từ Nơ Trang Long xuống nhìn bên tay trái",
            image: salon1
        }
    ],

    "Thái Nguyên": [
        {
            id: 1,
            address: "147 Lê Hồng Phong, P. Thống Nhất, TP Buôn Ma Thuột, Đắk Lắc",
            description: "Đối diện ngân hàng Agribank Quang Trung, đường Lương Ngọc Quyến",
            image: salon1
        }
    ],

    "Quảng Ninh": [
        {
            id: 1,
            address: "Time Garden, Đường 25/4, P. Bạch Đằng, TP Hạ Long, Quảng Ninh",
            description: "Đối diện cột đồng hồ",
            image: salon1
        }
    ],






  };