import { ReactNode } from "react";
import { IconType } from "react-icons";
import { Container, Box, Typography } from "@mui/material";

interface IProps {
  role: string;
  icon: IconType;
  color: string;
  children?: ReactNode;
}

const PageAccessTemplate = ({ role, icon: Icon, color, children }: IProps) => {
  return (
    <Box
      className="pageTemplate3"
      sx={{
        border: `2px solid ${color}`,
        borderRadius: 2,
        p: 3,
        my: 4,
      }}
    >
      <Container maxWidth="xl">
        <Box
          display="flex"
          alignItems="center"
          gap={3}
          mb={4}
          flexWrap="wrap"
          justifyContent="center"
        >
          {/* <Icon size={48} color={color} /> */}
          <Box color={color}>
            {/* <Typography variant="h4" fontWeight="bold">
              {`This is ${role} Page`}
            </Typography> */}
            {/* <Typography variant="body1">
              {`You must have ${role} access to see this page`}
            </Typography> */}
          </Box>
        </Box>

        <Box>{children}</Box>
      </Container>
    </Box>
  );
};

export default PageAccessTemplate;
