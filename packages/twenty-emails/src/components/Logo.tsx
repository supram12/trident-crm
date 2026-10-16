import { Img } from '@react-email/components';

import { EMAIL_BASE_URL } from 'src/constants/DefaultWorkspaceLogo';

const logoStyle = {
  marginBottom: '40px',
};

export const Logo = () => {
  return (
    <Img
      src={`${EMAIL_BASE_URL}/images/trident/email-logo.png`}
      alt="Trident CRM"
      width="160"
      height="150"
      style={logoStyle}
    />
  );
};
