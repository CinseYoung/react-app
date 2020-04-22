import React, { useEffect } from 'react'
import styles from './legend.less'

const initScreenBG = () => {

}

export default function Legend() {
	
	useEffect(() => {
		initScreenBG()
	}, [])

	return (
		<ul className={styles.legend}>
			<li className={styles.listItem}><h3>规划线：</h3><div className={styles.line}></div></li>
			<li className={styles.listItem}><h3>巡检线：</h3><div className={styles.line}></div></li>
		</ul>
	)
}