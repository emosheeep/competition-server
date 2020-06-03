import passport from 'passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { find } from '../db/dao'
import { USER } from '../db/model'
import secretKey from '../config/tokenKey'

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secretKey
}

const strategy = new Strategy(options, (payload, done) => {
  find(USER, {
    account: payload.account,
    identity: payload.identity
  }).then(users => {
    if (users.length !== 0) {
      const user = users[0]
      done(null, user)
    } else {
      done(null, false)
    }
  }).catch(err => {
    done(err, false)
  })
})

passport.use(strategy)

export default passport.authenticate('jwt', { session: false })
