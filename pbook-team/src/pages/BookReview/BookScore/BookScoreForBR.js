/* eslint-disable react/jsx-no-duplicate-props */
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Rating from '@material-ui/lab/Rating'
import FavoriteIcon from '@material-ui/icons/Favorite'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

const StyledRating = withStyles({
  iconFilled: {
    color: '#ff6d75',
  },
  iconHover: {
    color: '#ff3d47',
  },
})(Rating)

function getLabelText(value) {
  return `${value} Heart${value !== 1 ? 's' : ''}`
}

export default function CustomizedRatings(props) {
  const changeScore = e => {
    props.setScore_star(e)
  }
  return (
    <>
      <Box component="fieldset" ml={2} borderColor="transparent">
        <Typography component="legend"></Typography>
        <StyledRating
          key={props.score_star}
          onClick={changeScore}
          value={`${props.score_star}`}
          getLabelText={getLabelText}
          precision={1}
          name="star"
          icon={<FavoriteIcon fontSize="inherit" />}
        />
      </Box>
    </>
  )
}
