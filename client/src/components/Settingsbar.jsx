import React, { useState } from 'react'
import { ChromePicker } from 'react-color'
import { ReactComponent as PaletteSVG } from '../assets/img/color-palette.svg'
import toolState from '../store/toolState'


const Settingsbar = () => {
	const [isModal, setIsModal] = useState(false)
	const [colorPiker, setColorPicker] = useState('#fff')



	return (
		<div className="settingsbar">
			<div className="container" style={{display: 'flex', alignItems: 'center'}}>
				<div className='settingsbar-group1'>
				<p className='unselectable'>Толщина линии:</p>
				<input
					onChange={e => toolState.setLineWidth(e.target.value)}
					type="number"
					id="line-width"
					min={1}
					max={50}
					defaultValue={1}
				/>
				<p className='unselectable'>Цвет обводки</p>
				<div>
					<PaletteSVG className="settingsbar-button" onClick={() => setIsModal(!isModal)} />
					{
						isModal
						&&
						<ChromePicker
							className='settingsbar-button__colorpicker'
							disableAlpha
							color={colorPiker}
							onChange={color => {
								setColorPicker(color)
								toolState.setStrokeColor(color.hex)
							}
						}
						/>
					}
				</div>
				</div>
				

			</div>
		</div>
	)
}

export default Settingsbar