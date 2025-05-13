using System;
using System.Collections.Generic;
using System.Linq;
using Crestron.SimplSharpPro.DeviceSupport;
using Crestron.SimplSharpPro;

namespace MF_Huddle_Conf
{
    public interface IVolume
    {
        object UserObject { get; set; }

        event EventHandler<UIEventArgs> up_btn;
        event EventHandler<UIEventArgs> dwn_btn;
        event EventHandler<UIEventArgs> mute_btn;
        event EventHandler<UIEventArgs> level_set;
        event EventHandler<UIEventArgs> percenttx;

        void up_fb(VolumeBoolInputSigDelegate callback);
        void dwn_fb(VolumeBoolInputSigDelegate callback);
        void mute_fb(VolumeBoolInputSigDelegate callback);
        void level_fb(VolumeUShortInputSigDelegate callback);
        void percentrx(VolumeStringInputSigDelegate callback);

    }

    public delegate void VolumeBoolInputSigDelegate(BoolInputSig boolInputSig, IVolume volume);
    public delegate void VolumeUShortInputSigDelegate(UShortInputSig uShortInputSig, IVolume volume);
    public delegate void VolumeStringInputSigDelegate(StringInputSig stringInputSig, IVolume volume);

    internal class Volume : IVolume, IDisposable
    {
        #region Standard CH5 Component members

        private ComponentMediator ComponentMediator { get; set; }

        public object UserObject { get; set; }

        public uint ControlJoinId { get; private set; }

        private IList<BasicTriListWithSmartObject> _devices;
        public IList<BasicTriListWithSmartObject> Devices { get { return _devices; } }

        #endregion

        #region Joins

        private static class Joins
        {
            internal static class Booleans
            {
                public const uint up_btn = 1;
                public const uint dwn_btn = 2;
                public const uint mute_btn = 3;

                public const uint up_fb = 1;
                public const uint dwn_fb = 2;
                public const uint mute_fb = 3;
            }
            internal static class Numerics
            {
                public const uint level_set = 1;

                public const uint level_fb = 1;
            }
            internal static class Strings
            {
                public const uint percenttx = 1;

                public const uint percentrx = 1;
            }
        }

        #endregion

        #region Construction and Initialization

        internal Volume(ComponentMediator componentMediator, uint controlJoinId)
        {
            ComponentMediator = componentMediator;
            Initialize(controlJoinId);
        }

        private void Initialize(uint controlJoinId)
        {
            ControlJoinId = controlJoinId; 
 
            _devices = new List<BasicTriListWithSmartObject>(); 
 
            ComponentMediator.ConfigureBooleanEvent(controlJoinId, Joins.Booleans.up_btn, onup_btn);
            ComponentMediator.ConfigureBooleanEvent(controlJoinId, Joins.Booleans.dwn_btn, ondwn_btn);
            ComponentMediator.ConfigureBooleanEvent(controlJoinId, Joins.Booleans.mute_btn, onmute_btn);
            ComponentMediator.ConfigureNumericEvent(controlJoinId, Joins.Numerics.level_set, onlevel_set);
            ComponentMediator.ConfigureStringEvent(controlJoinId, Joins.Strings.percenttx, onpercenttx);

        }

        public void AddDevice(BasicTriListWithSmartObject device)
        {
            Devices.Add(device);
            ComponentMediator.HookSmartObjectEvents(device.SmartObjects[ControlJoinId]);
        }

        public void RemoveDevice(BasicTriListWithSmartObject device)
        {
            Devices.Remove(device);
            ComponentMediator.UnHookSmartObjectEvents(device.SmartObjects[ControlJoinId]);
        }

        #endregion

        #region CH5 Contract

        public event EventHandler<UIEventArgs> up_btn;
        private void onup_btn(SmartObjectEventArgs eventArgs)
        {
            EventHandler<UIEventArgs> handler = up_btn;
            if (handler != null)
                handler(this, UIEventArgs.CreateEventArgs(eventArgs));
        }

        public event EventHandler<UIEventArgs> dwn_btn;
        private void ondwn_btn(SmartObjectEventArgs eventArgs)
        {
            EventHandler<UIEventArgs> handler = dwn_btn;
            if (handler != null)
                handler(this, UIEventArgs.CreateEventArgs(eventArgs));
        }

        public event EventHandler<UIEventArgs> mute_btn;
        private void onmute_btn(SmartObjectEventArgs eventArgs)
        {
            EventHandler<UIEventArgs> handler = mute_btn;
            if (handler != null)
                handler(this, UIEventArgs.CreateEventArgs(eventArgs));
        }


        public void up_fb(VolumeBoolInputSigDelegate callback)
        {
            for (int index = 0; index < Devices.Count; index++)
            {
                callback(Devices[index].SmartObjects[ControlJoinId].BooleanInput[Joins.Booleans.up_fb], this);
            }
        }

        public void dwn_fb(VolumeBoolInputSigDelegate callback)
        {
            for (int index = 0; index < Devices.Count; index++)
            {
                callback(Devices[index].SmartObjects[ControlJoinId].BooleanInput[Joins.Booleans.dwn_fb], this);
            }
        }

        public void mute_fb(VolumeBoolInputSigDelegate callback)
        {
            for (int index = 0; index < Devices.Count; index++)
            {
                callback(Devices[index].SmartObjects[ControlJoinId].BooleanInput[Joins.Booleans.mute_fb], this);
            }
        }

        public event EventHandler<UIEventArgs> level_set;
        private void onlevel_set(SmartObjectEventArgs eventArgs)
        {
            EventHandler<UIEventArgs> handler = level_set;
            if (handler != null)
                handler(this, UIEventArgs.CreateEventArgs(eventArgs));
        }


        public void level_fb(VolumeUShortInputSigDelegate callback)
        {
            for (int index = 0; index < Devices.Count; index++)
            {
                callback(Devices[index].SmartObjects[ControlJoinId].UShortInput[Joins.Numerics.level_fb], this);
            }
        }

        public event EventHandler<UIEventArgs> percenttx;
        private void onpercenttx(SmartObjectEventArgs eventArgs)
        {
            EventHandler<UIEventArgs> handler = percenttx;
            if (handler != null)
                handler(this, UIEventArgs.CreateEventArgs(eventArgs));
        }


        public void percentrx(VolumeStringInputSigDelegate callback)
        {
            for (int index = 0; index < Devices.Count; index++)
            {
                callback(Devices[index].SmartObjects[ControlJoinId].StringInput[Joins.Strings.percentrx], this);
            }
        }

        #endregion

        #region Overrides

        public override int GetHashCode()
        {
            return (int)ControlJoinId;
        }

        public override string ToString()
        {
            return string.Format("Contract: {0} Component: {1} HashCode: {2} {3}", "Volume", GetType().Name, GetHashCode(), UserObject != null ? "UserObject: " + UserObject : null);
        }

        #endregion

        #region IDisposable

        public bool IsDisposed { get; set; }

        public void Dispose()
        {
            if (IsDisposed)
                return;

            IsDisposed = true;

            up_btn = null;
            dwn_btn = null;
            mute_btn = null;
            level_set = null;
            percenttx = null;
        }

        #endregion

    }
}
