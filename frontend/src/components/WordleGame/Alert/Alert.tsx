import "./Alert.css";

const Alert = ({
  alertMessage,
}: {
  alertMessage: {
    message: string;
    status: "success" | "info" | "error";
  } | null;
}) => {
  return (
    <>
      {alertMessage && (
        <div className={"alert-message " + alertMessage.status}>
          {alertMessage.message}
        </div>
      )}
    </>
  );
};

export default Alert;
