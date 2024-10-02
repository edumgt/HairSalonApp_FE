import React from "react";
import "./index.scss"; // Assuming you'll create a CSS file for styling
import  Aboutimage1 from "../../assets/imageAbout/1.jpg";
import  Aboutimage2 from "../../assets/imageAbout/2.jpg";
import  Aboutimage3 from "../../assets/imageAbout/3.jpg";


function About() {

  
  return (
    <div className="about-container">
      <section className="about-section">
        <h2 className="about-section-title">30Shine - Chuỗi tóc nam hiện đại</h2>
        <p className="about-text">Khởi sự bằng tinh thần khám phá, khát vọng đổi mới, 30Shine muốn thổi bùng lên ngọn lửa thành công, chiến thắng ở mỗi người đàn ông hiện đại, dựa trên nền tảng vững chắc từ:</p>
        <ul className="about-list">
          <li className="about-list-item">- Đội ngũ tài năng, chuyên nghiệp thấu hiểu và mang đến phong cách tóc tuyệt vời.</li>
          <li className="about-list-item">- Công nghệ hóa trải nghiệm cắt tóc giúp stylist hiểu chính xác mong muốn của khách hàng</li>
          <li className="about-list-item">- Không gian salon tóc hiện đại với những công nghệ được ưa chuộng thế giới</li>
          <li className="about-list-item">- Trải nghiệm cắt tóc, nghỉ ngơi, thư giãn, chăm sóc da có một không hai dành cho phái mạnh</li>
        </ul>
      </section>
      
      <div className="image-layout">
        <img src={Aboutimage1} alt="30Shine salon" className="large-image" />
        <div className="small-images">
          <img src={Aboutimage2} alt="30Shine service" />
          <img src={Aboutimage3} alt="30Shine style" />
        </div>
      </div>

      

      <section className="about-section">
        <h2 className="about-section-title">Ý nghĩa logo và thương hiệu:</h2>
        <p className="about-text">30Shine đại diện cho tuổi 30 toả sáng của mỗi người đàn ông- độ tuổi mang ý nghĩa biểu tượng mạnh mẽ đại diện cho ngọn lửa thành công, khát vọng chiến thắng và ý chí vươn lên của bất kỳ người đàn ông hiện đại nào. Tên gọi được thể hiện qua Logo nam nhân tỏa sáng cùng font chữ cứng cáp hiện đại và công nghệ như một sự khẳng định mạnh mẽ cho tinh thần chiến thắng, khát vọng thành công.</p>
      </section>

      <section className="about-section">
        <h2 className="about-section-title">Tầm nhìn 2030:</h2>
        <p className="about-text">30Shine đạt quy mô 1000 salon tại Việt Nam, trở thành thương hiệu lớn Đông Nam Á, mang tính biểu tượng trong ngành tóc thế giới và niêm yết thành công trên thị trường chứng khoán.</p>
      </section>

      <section className="about-section">
        <h2 className="about-section-title">Sứ mệnh:</h2>
        <p className="about-text">30Shine không ngừng quan tâm và lan tỏa niềm tin tới mọi người để cùng đổi mới và có cuộc sống ý nghĩa hơn.</p>
      </section>

      <section className="about-section">
        <h2 className="about-section-title">Các cột mốc:</h2>
        <ul className="about-list">
          <li className="about-list-item"><strong>Tháng 5/2015:</strong> Mở salon đầu tiên tại Hà Nội, khởi nghiệp với rất nhiều hoài bão, ước mơ lớn.</li>
          <li className="about-list-item"><strong>Tháng 6/2016:</strong> Mở salon đầu tiên tại thị trương Hồ Chí Minh và lập kỷ lục về lượt khách ngay trong tháng đầu khai trương.</li>
          <li className="about-list-item"><strong>Tháng 12/2016:</strong> Chạm mốc 50 salon đầu tiên, trở thành chuỗi salon tóc Nam lớn Việt Nam cả về đội ngũ nhân sự, quy mô salon, sự ủng hộ của đông đảo khách hàng.</li>
          <li className="about-list-item"><strong>Tháng 3/2021:</strong> Chạm mốc khách hàng thứ 10 triệu sau 6 năm thành lập.</li>
          <li className="about-list-item"><strong>Tháng 10/2021:</strong> Vượt qua và vươn lên mạnh mẽ sau Covid cùng hàng triệu khách hàng viết tiếp câu chuyện về cảm hứng thành công khát khao chiến thắng của phái mạnh hiện đại.</li>
          <li className="about-list-item"><strong>Tháng 6/2023:</strong> Nhận đầu tư serie A từ quỹ ECV (Singapore) và APG (Japan) giữa lúc thị trường vốn tư nhân Việt Nam gần như đóng băng vì suy thoái kinh tế.</li>
          <li className="about-list-item"><strong>Tháng 6/2023:</strong> Công bố nhận diện thương hiệu mới cùng tầm nhìn mới.</li>
          <li className="about-list-item"><strong>Tháng 12/2023:</strong> Chạm mốc 100 salon, trở thành chuỗi salon tóc nam có quy mô lớn Đông Nam Á.</li>
        </ul>
      </section>
    </div>
  );
}

export default About;
