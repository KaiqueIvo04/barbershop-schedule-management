import Mongoose from 'mongoose'

interface IWorkScheduleModel extends Mongoose.Document {
}

const WorkScheduleSchema = new Mongoose.Schema({
    employee_id: {
        type: Mongoose.Schema.Types.ObjectId,
        index: true
    },
    week_start_day: Date,
    work_days: {
        monday: {
            is_working: Boolean,
            start_time: String,
            end_time: String
        },
        tuesday: {
            is_working: Boolean,
            start_time: String,
            end_time: String
        },
        wednesday: {
            is_working: Boolean,
            start_time: String,
            end_time: String
        },
        thursday: {
            is_working: Boolean,
            start_time: String,
            end_time: String
        },
        friday: {
            is_working: Boolean,
            start_time: String,
            end_time: String
        },
        saturday: {
            is_working: Boolean,
            start_time: String,
            end_time: String
        },
        sunday: {
            is_working: Boolean,
            start_time: String,
            end_time: String
        }
    },
    responsible_admin_id: {
        type: Mongoose.Schema.Types.ObjectId,
        index: true
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id
            delete ret._id
            delete ret.__v
            return ret
        }
    }
})

// Removes optional fields sended with empty strings in findOneAndUpdate operations
WorkScheduleSchema.pre('findOneAndUpdate', function (_next) {
    const next = getNext(_next)
    try {
        const updateParams = this.getUpdate()
        if (updateParams) {
            // Building $unset parameter to remove optional fields.
            for (const key of Object.keys(updateParams)) {
                if (updateParams[key] === '') {
                    const unsetKey = '$unset'
                    if (!updateParams[unsetKey]) updateParams[unsetKey] = {}
                    updateParams[unsetKey][key] = 1
                    delete updateParams[key]
                }
            }
        }
        next()
    } catch (err) {
        next(err)
    }
})

// For mongoose 4/5 compatibility.
function nextErr(err) {
    if (err) throw err
}

function getNext(next) {
    if (typeof next !== 'function') return nextErr
    return next
}

// Sets created_at as index.
WorkScheduleSchema.index({ created_at: 1 })

export const WorkScheduleRepoModel = Mongoose.model<IWorkScheduleModel>('WorkSchedule', WorkScheduleSchema)
