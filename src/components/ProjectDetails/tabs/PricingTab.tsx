import React from 'react';
import Pricing from '../../pages/Pricing';

interface PricingTabProps {
  projectId?: string;
}

const PricingTab: React.FC<PricingTabProps> = ({ projectId }) => {
  return (
    <div className="pricing-tab">
      <Pricing />
    </div>
  );
};

export default PricingTab;
