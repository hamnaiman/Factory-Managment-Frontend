function AttendanceSummary({ workers, attendance }) {
  const present = workers.filter((worker) =>
    attendance.find(
      (item) =>
        item.worker === worker._id &&
        item.status === "present"
    )
  );

  const absent = workers.filter((worker) =>
    attendance.find(
      (item) =>
        item.worker === worker._id &&
        item.status === "absent"
    )
  );

  const leave = workers.filter((worker) =>
    attendance.find(
      (item) =>
        item.worker === worker._id &&
        item.status === "leave"
    )
  );

  return (
    <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Today's Attendance Summary
          </h2>

          <p className="mt-1 text-slate-500">
            {new Date().toDateString()}
          </p>
        </div>

      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-3">

        <div className="rounded-2xl bg-green-50 p-5">
          <h3 className="font-semibold text-green-700">
            Present ({present.length})
          </h3>

          <div className="mt-3 space-y-2">
            {present.map((worker) => (
              <p key={worker._id}>{worker.name}</p>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-red-50 p-5">
          <h3 className="font-semibold text-red-700">
            Absent ({absent.length})
          </h3>

          <div className="mt-3 space-y-2">
            {absent.map((worker) => (
              <p key={worker._id}>{worker.name}</p>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-orange-50 p-5">
          <h3 className="font-semibold text-orange-700">
            Leave ({leave.length})
          </h3>

          <div className="mt-3 space-y-2">
            {leave.map((worker) => (
              <p key={worker._id}>{worker.name}</p>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

export default AttendanceSummary;