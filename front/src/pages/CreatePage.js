import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { useHttp } from '../hooks/http.hook';
import { AuthContext } from '../context/AuthContext';

export const CreatePage = () => {
    const auth = useContext(AuthContext)

    const history = useHistory()

    const [link, setLink] = useState('');
    const { request } = useHttp()

    useEffect(() => {
        window.M.updateTextFields()
    }, []);

    const pressHandler = async e => {
        if (e.key === 'Enter') {
            try {
                const data = await request('/api/link/generate', 'POST', { from: link }, {
                    Authorization: `Bearer ${auth.token}`
                })
                console.log(data)
                history.push(`/detail/${data.link._id}`)
            } catch(e) {}
        }
    }
    return (
        <div className="row">
            <div className="col s8 offset-s2" style={{paddingTop: '2rem'}}>
                <div className="input-field">
                    <input 
                        placeholder="Вставте ссылку"
                        id="link"
                        value={link}
                        type="text"
                        onChange={e => setLink(e.target.value)}
                        onKeyPress={pressHandler}
                    />
                    <label htmlFor="link">Введите ссылку</label>
                </div>
            </div>
        </div>
    )
}