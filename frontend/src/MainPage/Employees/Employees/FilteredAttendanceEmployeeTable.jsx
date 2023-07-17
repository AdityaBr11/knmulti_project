import React from 'react';
import { DAILY_WORKING_HOURS } from '../../../misc/constants';

const FilteredAttendanceEmployeeTable = ({ data }) => {
  console.log(data,'data from FAET');
  return (
    <>
      <div className="table-responsive">
        <table className="table table-striped custom-table mb-0">
          <thead>
            <tr>
              <th>#</th>
              <th>Date </th>
              <th>Punch In</th>
              <th>Punch Out</th>
              <th>Production</th>
              <th>Break</th>
              <th>Overtime</th>
            </tr>
          </thead>
          <tbody>
            {data?.length === 0 ? (
              <></>
            ) : (
              data.sort((a,b)=>{ return new Date(a.date) - new Date(b.date)}).map((element, index) => (
                <tr>
                  <td>{index + 1}</td>
                  <td>{new Date(element?.date).toLocaleDateString()}</td>
                  <td>{new Date(element?.sessions[0]?.from).toLocaleTimeString()}</td>
                  <td>{new Date(element?.sessions[0]?.upto).toLocaleTimeString()}</td>
                  <td>{Number(element?.hours).toFixed(3)}</td>
                  <td>
                    {Math.abs(
                      Number(DAILY_WORKING_HOURS - element?.hours).toFixed(3)
                    )}
                  </td>
                  <td>
                    {DAILY_WORKING_HOURS - Number(element?.hours) < 0
                      ? Math.abs(
                          DAILY_WORKING_HOURS - Number(element?.hours)
                        ).toFixed(3)
                      : 0}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default FilteredAttendanceEmployeeTable;
