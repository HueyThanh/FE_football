import { formatDistanceToNow } from "date-fns";
import PropTypes from "prop-types";
import ArrowRightIcon from "@heroicons/react/24/solid/ArrowRightIcon";
import EllipsisVerticalIcon from "@heroicons/react/24/solid/EllipsisVerticalIcon";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  SvgIcon,
  styled,
} from "@mui/material";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

export const OverviewTeamRank = (props) => {
  const { products = [], sx, title } = props;

  return (
    <Card className="form-container" sx={sx}>
      <CardHeader title={title} />
      <List>
        {products.map((product, index) => {
          const hasDivider = index < products.length - 1;
          const goal = product?.goal;
          return (
            <ListItem divider={hasDivider} key={product.id}>
              <ListItemAvatar>
                <Avatar style={{ background: "orange" }} variant="rounded">
                  {index + 1}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`${product?.team?.teamName} - ${product?.tournament?.tournamentsName}`}
                primaryTypographyProps={{ variant: "subtitle1" }}
                secondary={`Coach name: ${product?.team?.coachName}`}
                secondaryTypographyProps={{ variant: "body2" }}
              />
              <IconButton edge="end">
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant="dot"
                >
                  <Avatar>{product?.points}</Avatar>
                </StyledBadge>
              </IconButton>
            </ListItem>
          );
        })}
      </List>
      <Divider />
    </Card>
  );
};

OverviewTeamRank.propTypes = {
  products: PropTypes.array,
  sx: PropTypes.object,
};
