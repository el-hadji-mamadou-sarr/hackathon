export const Dropdown = ({
  scan,
  locker_number,
  authenticated,
  openLocker,
  closeLocker,
}) => {
  return (
    <div className="top-48 dropdown-content ">
      {authenticated.locker_number != locker_number ? (
        <button onClick={() => scan(locker_number)}>scan</button>
      ) : (
        <>
          <button onClick={() => openLocker(locker_number)}>open</button>
          <button onClick={() => closeLocker(locker_number)}>close</button>
          <button>lock</button>
        </>
      )}
    </div>
  );
};
