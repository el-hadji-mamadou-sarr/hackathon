export const Dropdown = ({
  scan,
  locker_number,
  authenticated,
  openLocker,
  closeLocker,
  lockLocker,
}) => {
  return (
    <div className="top-48 dropdown-content ">
      {authenticated.locker_number != locker_number ? (
        <button onClick={() => scan(locker_number)}>scan</button>
      ) : (
        <>
          <button onClick={() => openLocker(locker_number)}>open</button>
          <button onClick={() => closeLocker(locker_number)}>close</button>
          <button onClick={() => lockLocker(locker_number)}>lock</button>
        </>
      )}
    </div>
  );
};
