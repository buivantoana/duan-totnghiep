import React from 'react';
import './RankList.css';

const RankList = ({ rankData }) => {


   const formatCurrency = (amount) => {
      return new Intl.NumberFormat('vi-VN', {
         style: 'currency',
         currency: 'VND'
      }).format(amount);
   };

   const getRankStyles = (rank) => {
      switch (rank) {
         case 'Gold':
            return {
               gradient: 'linear-gradient(135deg, #ffd700, #ffa500)',
               shadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
            };
         case 'Silver':
            return {
               gradient: 'linear-gradient(135deg, #c0c0c0, #808080)',
               shadow: '0 4px 15px rgba(192, 192, 192, 0.3)'
            };
         default:
            return {
               gradient: 'linear-gradient(135deg, rgb(255, 255, 255), rgb(26 17 1))',
               shadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
            };
      }
   };

   return (
      <div className="rank-container">
         <h5 className="rank-title">Bảng Xếp Hạng</h5>
         <div className="rank-list">
            {rankData.map((item, index) => {
               const styles = getRankStyles(item.rank);
               return (
                  <div
                     key={index}
                     className="rank-card"
                     style={{
                        background: styles.gradient,
                        boxShadow: styles.shadow
                     }}
                  >
                     <div className="rank-position">
                        #{index + 1}
                     </div>
                     <div className="rank-content">
                        <div className="rank-badge">
                           <span className="rank-text">{item.rank}</span>
                        </div>
                        <div className="user-details">
                           <h6 className="user-name">
                              {
                                  `${item.firstName} ${item.lastName}`
                                }
                           </h6>
                           <div className="user-stats">

                              <span className="spent-amount">
                                 Điểm thưởng : {item.points}
                              </span>
                           </div>
                        </div>
                     </div>
                  </div>
               );
            })}
         </div>
      </div>
   );
};

export default RankList;