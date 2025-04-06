import React, { useEffect, useState } from 'react';
import { getDetailUserById } from '../../services/userService';

function ApplyPointsCheckbox({ userId, onApplyPoints }) {
   const [isChecked, setIsChecked] = useState(false);
   const [pointsToApply, setPointsToApply] = useState(0);

   useEffect(() => {
      if (userId) {
         (async () => {
            try {
               let user = await getDetailUserById(userId)
               if (user && user.errCode === 0) {
                  setPointsToApply(user.data.points)
               }
            } catch (error) {

            }
         })()
      }
   }, [userId])

   const handleCheckboxChange = () => {
      setIsChecked(!isChecked);
      if (!isChecked) {
         onApplyPoints(pointsToApply);

      } else {
         onApplyPoints(0);
      }

   };

   return (
      <div className="apply-points-checkbox">
         {pointsToApply != 0 &&
            <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
               <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
               />
               <span style={{ fontWeight: "bold" }}>Áp dụng {pointsToApply} điểm thưởng</span>
            </label>}
      </div>
   );
}

export default ApplyPointsCheckbox;
