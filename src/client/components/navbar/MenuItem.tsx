import * as React from "react"
import { motion } from "framer-motion"

const ItemVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 }
    }
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 }
    }
  }
}
  
const colors = ["#FF008C", "#D309E1", "#9C1AFF", "#7700FF", "#4400FF"];

export const MenuItem = ({ index, text, icon, action }: any) => {
  const style = { border: `2px solid ${colors[index]}`, color: colors[index] }
  const fontStyle = { color: colors[index] }
  
  return (
    <motion.li
      onClick={action}
      variants={ItemVariants}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="icon-placeholder" style={style}>
        {icon}
      </div>
      <div className="text-placeholder" style={fontStyle}>
        {text}
      </div>
    </motion.li>
  )
}