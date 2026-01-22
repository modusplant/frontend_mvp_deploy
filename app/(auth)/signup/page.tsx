import SignupForm from "@/components/auth/signup/signupForm";

export default function SignupPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-[480px] rounded-[28px] bg-white p-6 pb-12 md:p-8 md:pb-16 lg:p-10 lg:pb-20">
        <h1 className="mb-8 text-center text-xl font-bold text-black md:mb-10 md:text-2xl">
          회원가입
        </h1>
        <SignupForm />
      </div>
    </div>
  );
}
