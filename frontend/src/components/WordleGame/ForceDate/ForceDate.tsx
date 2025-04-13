const ForceDate = () => {
  const forceDateLocalStorageKey = "force-date";
  return (
    <>
      <input
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
