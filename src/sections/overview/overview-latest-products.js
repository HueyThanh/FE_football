import { formatDistanceToNow } from "date-fns";
import PropTypes from "prop-types";
import ArrowRightIcon from "@heroicons/react/24/solid/ArrowRightIcon";
import EllipsisVerticalIcon from "@heroicons/react/24/solid/EllipsisVerticalIcon";
import {
  Avatar,
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
} from "@mui/material";

export const OverviewLatestProducts = (props) => {
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
                {product.image ? (
                  <Box
                    component="img"
                    src={product.image}
                    sx={{
                      borderRadius: 1,
                      height: 48,
                      width: 48,
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      borderRadius: 1,
                      backgroundColor: "neutral.200",
                      height: 48,
                      width: 48,
                    }}
                  />
                )}
              </ListItemAvatar>
              <ListItemText
                primary={product.name}
                primaryTypographyProps={{ variant: "subtitle1" }}
                secondary={`Got ${goal} goals`}
                secondaryTypographyProps={{ variant: "body2" }}
              />
            </ListItem>
          );
        })}
      </List>
      <Divider />
    </Card>
  );
};

OverviewLatestProducts.propTypes = {
  products: PropTypes.array,
  sx: PropTypes.object,
};
