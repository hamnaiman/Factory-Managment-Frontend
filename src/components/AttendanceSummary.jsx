import { useEffect, useState } from "react";
import { getPayments } from "../services/paymentService";

function AttendanceSummary({ workers, attendance }) {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const res = await getPayments();
      setPayments(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

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
    <>
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

        {/* Present */}

        <div className="rounded-2xl bg-green-50 p-5">
          <h3 className="font-semibold text-green-700">
            Present ({present.length})
          </h3>

          <div className="mt-3 space-y-3">
            {present.map((worker) => {

              const payment = payments.find(
                (p) => p.worker?._id === worker._id
              );

              return (
                <div
                  key={worker._id}
                  className="flex items-center justify-between"
                >
                  <span>{worker.name}</span>

                  {payment ? (
                    <span className="text-sm font-semibold text-green-700">
                      Rs. {payment.amount}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">
                      No Payment
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Absent */}

        <div className="rounded-2xl bg-red-50 p-5">
          <h3 className="font-semibold text-red-700">
            Absent ({absent.length})
          </h3>

          <div className="mt-3 space-y-3">
            {absent.map((worker) => {

              const payment = payments.find(
                (p) => p.worker?._id === worker._id
              );

              return (
                <div
                  key={worker._id}
                  className="flex items-center justify-between"
                >
                  <span>{worker.name}</span>

                  {payment ? (
                    <span className="text-sm font-semibold text-green-700">
                      Rs. {payment.amount}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">
                      No Payment
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Leave */}

        <div className="rounded-2xl bg-orange-50 p-5">
          <h3 className="font-semibold text-orange-700">
            Leave ({leave.length})
          </h3>

          <div className="mt-3 space-y-3">
            {leave.map((worker) => {

              const payment = payments.find(
                (p) => p.worker?._id === worker._id
              );

              return (
                <div
                  key={worker._id}
                  className="flex items-center justify-between"
                >
                  <span>{worker.name}</span>

                  {payment ? (
                    <span className="text-sm font-semibold text-green-700">
                      Rs. {payment.amount}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">
                      No Payment
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </>
  );
}

export default AttendanceSummary;