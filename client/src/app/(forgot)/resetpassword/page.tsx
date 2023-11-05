"use client";
import AuthContainer from "@/components/AuthContainer";
import ResetContent from "@/layouts/forgot/ResetContent";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ForgotPage = () => {
  const succesNotify = () => {
    toast.success(
      "Thay đổi mật khẩu thành công, chuyển hướng về trang đăng nhập"
    );
  };
  const errorNotify = () => {
    toast.error("Mật khẩu không hợp lệ. Vui lòng thử lại");
  };
  return (
    <>
      <ToastContainer
        limit={1}
        position="top-center"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
        className={"text-[14px] ml-1"}
      />
      <AuthContainer left={false}>
        <ResetContent
          onErrorNotify={errorNotify}
          onSuccessNotify={succesNotify}
        ></ResetContent>
      </AuthContainer>
    </>
  );
};
export default ForgotPage;
