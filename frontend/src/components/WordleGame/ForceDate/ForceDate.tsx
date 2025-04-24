const ForceDate = () => {
  const forceDateLocalStorageKey = "force-date";
  return (
    <>
      <input
        style={{ display: "none" }}
        onChange={(event) =>
          window.localStorage.setItem(
            forceDateLocalStorageKey,
            event.target.value
          )
        }
      ></input>
    </>
  );
};

export default ForceDate;
