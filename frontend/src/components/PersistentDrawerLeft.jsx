import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import axios from "axios";
import { format } from "date-fns";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useNavigate } from "react-router-dom";

import PreviewModal from "./PreviewModal";
const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    variants: [
      {
        props: ({ open }) => open,
        style: {
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          marginLeft: 0,
        },
      },
    ],
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(["margin", "width"], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function PersistentDrawerLeft({ children }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [recentChats, setRecentChats] = React.useState([]);
  const navigate = useNavigate();

  const fetchRecentChats = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/chat", {
        withCredentials: true,
      });
      setRecentChats(response.data);
      // console.log(response.data);
    } catch (error) {
      console.error("Error fetching recent chats:", error);
    }
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const opennewchat = async () => {
    setModalOpen(true);
  };

  const handledeleteChat = async (chatId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/chat/${chatId}`,
        { withCredentials: true }
      );
      // console.log(response.data);
      setRecentChats((prevChats) =>
        prevChats.filter((chat) => chat.chatId !== chatId)
      );
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        navigate("/login");
      } else {
        alert(response.data.error);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  React.useEffect(() => {
    fetchRecentChats();
  }, []);

  const [modalOpen, setModalOpen] = React.useState(false);
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <PreviewModal open={modalOpen} handleClose={handleCloseModal} />
      <CssBaseline />
      <AppBar position="fixed" open={open} color="transparent">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                mr: 2,
              },
              open && { display: "none" },
            ]}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            ConfidenceAI
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/")}>
              <ListItemIcon>
                <HomeRoundedIcon />
              </ListItemIcon>
              <ListItemText primary={"Home"} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutRoundedIcon />
              </ListItemIcon>
              <ListItemText primary={"Logout"} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={opennewchat}>
              <ListItemIcon>
                <AddCircleRoundedIcon />
              </ListItemIcon>
              <ListItemText primary={"New Chat"} />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <span className="text-black text-md pl-4 font-bold pt-2 ">
          Recent Chats
        </span>
        <List>
          {recentChats.map((chat) => (
            <ListItem key={chat._id} disablePadding>
              <button className="flex flex-row items-center w-full p-2 hover:bg-gray-100">
                <p
                  className="text-blue-800 text-lg pl-4  pt-2 "
                  onClick={() => navigate(`/c/${chat.chatId}`)}
                >
                  {format(new Date(chat.createdAt), "EEE, dd MMM yyyy")}
                </p>
                <DeleteRoundedIcon
                  color="error"
                  className="ml-auto mr-4 hover:text-red-800"
                  onClick={() => handledeleteChat(chat.chatId)}
                />
              </button>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  );
}
