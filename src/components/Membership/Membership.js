import React from "react";
import "./Membership.css";
import membershipTable from "../../assets/images/membership.png";

const Membership = () => {
  return (
    <div className="membership-section">
      <h1 className="membership-title">MEMBERSHIP</h1>
      <div className="membership-divider">
        <span className="star">★</span>
        <span className="star">★</span>
        <span className="star">★</span>
      </div>

      <p className="membership-desc">
        Chương trình bao gồm 4 đối tượng thành viên <strong>U22</strong>,{" "}
        <strong>BC Member</strong>, <strong>BC VIP</strong> và{" "}
        <strong>BC VVIP</strong>, với những quyền lợi và mức ưu đãi khác nhau.
        Mỗi khi thực hiện giao dịch tại hệ thống rạp BC, bạn sẽ nhận được một số
        điểm thưởng tương ứng với cấp độ thành viên:
      </p>

      <div className="membership-table-wrapper">
        <img
          src={membershipTable}
          alt="Membership table"
          className="membership-table"
        />
      </div>

      <div className="membership-note">
        <p>
          <strong>1 điểm = 1.000 VND</strong>, có giá trị như tiền mặt, được
          dùng để mua vé xem phim, thức uống / combo tương ứng tại BC và đổi
          voucher ưu đãi trên BC Reward. Ví dụ: Với giao dịch mua vé giá 100.000
          VND bạn có thể:
        </p>
        <ul>
          <li>Thanh toán với 80.000 VND + 20 điểm thưởng</li>
          <li>Thanh toán với 10.000 VND + 90 điểm thưởng</li>
        </ul>
        <strong>Cách làm tròn điểm thưởng:</strong>
        <ul>
          <li>
            Từ 0.1 đến 0.4: làm tròn xuống (Ví dụ: 3.2 điểm sẽ được tích vào tài
            khoản 3 điểm). Lưu ý: giao dịch có điểm tích lũy từ 0.1 đến 0.4 sẽ
            không được tích lũy điểm do làm tròn xuống 0, và đồng nghĩa với
            không được tích lũy chi tiêu.
          </li>
          <li>
            Từ 0.5 đến 0.9: làm tròn lên (Ví dụ: 3.6 điểm sẽ được tích vào tài
            khoản 4 điểm)
          </li>
        </ul>
      </div>
      <div className="membership-warning-wrapper">
        <strong>Lưu ý:</strong>
        <ul className="membership-warning">
          <li>
            Điểm thưởng có thời hạn sử dụng là 01 năm. Ví dụ: Điểm của bạn được
            nhận vào 08:00 ngày 05/01/2025 sẽ hết hạn sử dụng vào lúc 07:59:59
            ngày 05/01/2026.
          </li>
          <li>
            Điểm thưởng có giá trị sử dụng tại tất cả các rạp BC trên toàn quốc.
          </li>
          <li>
            Sau khi dịch vụ được BC Việt Nam hoàn thành, điểm thưởng sẽ được ghi
            nhận vào tài khoản của bạn vào 8:00 sáng ngày tiếp theo. Ví dụ: suất
            chiếu của bạn diễn ra vào ngày 05/01/2025, điểm thưởng sẽ được ghi
            nhận vào tài khoản của bạn vào 8:00 sáng ngày 06/01/2025.
          </li>
          <li>
            KHÔNG tích lũy chi tiêu/điểm thưởng đối với các giao dịch đã áp dụng
            các chương trình giảm giá/khuyến mại do BC và đối tác tổ chức bao
            gồm: Thẻ BCian/ CJ, Movie Pass, Upgrade Ticket (dành cho thành viên
            VIP/ VVIP), coupon Sinh Nhật, các mã giảm giá từ BC và đối tác
            (ZaloPay, VNPay, MoMo, Ngân hàng,...)
          </li>
          <li>
            Khách hàng sẽ không được tính tích lũy chi tiêu cũng như tích lũy
            điểm thưởng đối với các giao dịch hoàn, hủy vé.
          </li>
          <li>
            Thành viên được tích lũy điểm/chi tiêu cho tối đa 10 giao dịch/ngày.{" "}
          </li>
          <li>
            Điểm thưởng tối thiểu được sử dụng cho mỗi giao dịch là 10 điểm trở
            lên.
          </li>
          <li>
            Thành viên khi thanh toán trực tuyến trên Website/APP, trong 1 giao
            dịch, điểm thưởng chỉ được sử dụng thanh toán tối đa 90% giá trị đơn
            hàng.
          </li>
          <li>
            Khi thực hiện các giao dịch sử dụng điểm thưởng hoặc vé miễn phí
            trực tiếp tại rạp, khách hàng vui lòng xuất trình tài khoản thành
            viên (Thẻ cứng hoặc tài khoản online trên Ứng dụng BC) và Giấy tờ
            tùy thân hoặc giấy tờ khác có thể hiện ngày tháng năm sinh (Bản gốc
            hoặc ảnh chụp) cho nhân viên rạp để tiến hành xác thực chính chủ tài
            khoản thành viên. Nhân viên rạp có quyền từ chối yêu cầu của khách
            hàng nếu khách hàng không cung cấp được tài khoản thành viên và/hoặc
            giấy tờ quy định tại đây hoặc các thông tin Khách Hàng cung cấp
            không trùng khớp với nhau. Việc thực hiện các giao dịch sử dụng điểm
            thưởng hoặc vé miễn phí trên website của BC và/hoặc ứng dụng BC trên
            điện thoại luôn được mặc định là được sử dụng bởi chính chủ tài
            khoản thành viên. Khách Hàng có nghĩa vụ bảo mật tài khoản Thành
            Viên của mình. BC Việt Nam sẽ không giải quyết bất kỳ khiếu nại nào
            liên quan đến điểm thưởng nếu giao dịch sử dụng điểm thưởng đó được
            thực hiện trực tuyến.
          </li>
          <li>
            Khi mua vé online và thanh toán bằng các hình thức điểm, coupon,
            voucher, thẻ Premium card, CJ member, thẻ quà tặng, hệ thống sẽ yêu
            cầu bạn nhập mật mã thanh toán
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Membership;
