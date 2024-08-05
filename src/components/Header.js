import React, { useEffect, useState } from 'react';
import { AppBar, Autocomplete, IconButton, Tab, Tabs, TextField, Toolbar } from "@mui/material";
import { Box } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";
import MovieIcon from '@mui/icons-material/Movie';
import { getAllMovies } from '../api-helpers/api-helpers';
import { Link, useLocation } from 'react-router-dom';
import { adminActions, userActions } from "../store";

const Header = () => {
  const dispatch = useDispatch();
  const isAdminLoggedIn = useSelector((state) => state.admin.isLoggedIn);
  const isUserLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const [movies, setMovies] = useState([]);
  const [value, setValue] = useState(0); // State to manage the selected tab
  const location = useLocation();

  // Use effect to set the initial tab value based on the current path
  useEffect(() => {
    const pathToTabValue = {
      '/movies': 0,
      '/admin': 1,
      '/auth': 2,
      '/user': 3,
      '/add': 4,
      '/user-admin': 5,
    };
    setValue(pathToTabValue[location.pathname] || 0); // Default to Movies tab
  }, [location.pathname]);

  useEffect(() => {
    getAllMovies()
      .then((data) => setMovies(data.movies))
      .catch((err) => console.log(err));
  }, []);

  const logout = (isAdmin) => {
    dispatch(isAdmin ? adminActions.logout() : userActions.logout());
  };

  const handleChange = (event, newValue) => {
    setValue(newValue); // Update the selected tab value
  };

  return (
    <AppBar position='sticky' sx={{ bgcolor: "#2b2d42" }}>
      <Toolbar>
        <Box width={"20%"}>
          <IconButton LinkComponent={Link} to="/" sx={{ color: "white" }}>
            <MovieIcon />
          </IconButton>
        </Box>
        <Box width={"30%"} margin="auto">
          <Autocomplete
            freeSolo
            options={movies && movies.map((option) => option.title)}
            renderInput={(params) =>
              <TextField
                sx={{
                  input: { color: "white" },
                  '& .MuiInput-underline:before': {
                    borderBottomColor: 'rgba(255, 255, 255, 0.5)', // Default color
                  },
                  '& .MuiInput-underline:hover:before': {
                    borderBottomColor: 'white', // Hover color
                  },
                  '& .MuiInput-underline:after': {
                    borderBottomColor: 'white', // Focus color
                  },
                }}
                variant='standard' {...params}
                placeholder="Search" />}
          />
        </Box>
        <Box display={"flex"}>
          <Tabs
            textColor='inherit'
            indicatorColor='secondary'
            value={value} // Set the dynamic value based on the selected tab
            onChange={handleChange} // Update the tab value when changed
          >
            <Tab LinkComponent={Link} to="/movies" label="Movies" />
            {!isAdminLoggedIn && !isUserLoggedIn && (
              <>
                <Tab LinkComponent={Link} to="/admin" label="Admin" />
                <Tab LinkComponent={Link} to="/auth" label="Auth" />
              </>
            )}
            {isUserLoggedIn && (
              <>
                <Tab LinkComponent={Link} to="/user" label="Profile" />
                <Tab onClick={() => logout(false)} LinkComponent={Link} to="/" label="Logout" />
              </>
            )}
            {isAdminLoggedIn && (
              <>
                <Tab LinkComponent={Link} to="/add" label="Add movie" />
                <Tab LinkComponent={Link} to="/user-admin" label="Profile" />
                <Tab onClick={() => logout(true)} LinkComponent={Link} to="/" label="Logout" />
              </>
            )}
          </Tabs>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
