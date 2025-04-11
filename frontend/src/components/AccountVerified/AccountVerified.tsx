const AccountVerified = () => {
  return (
    <div className="flex w-full items-center justify-center p-[3rem] flex-col">
      <p>Thank you for verifying your Wordy account!</p>
      <p>
        You can either <a href="/">play</a> or{" "}
        <a href="/login">login right now.</a>
      </p>
    </div>
  );
};

export default AccountVerified;
