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

        event EventHandler<UIEventArgs> VolUp_btn;
        event EventHandler<UIEventArgs> VolDwn_btn;
        event EventHandler<UIEventArgs> VolMute_btn;
        event EventHandler<UIEventArgs> VolLevel_Set;
        event EventHandler<UIEventArgs> VolPercentTX;

        void VolUp_FB(VolumeBoolInputSigDelegate callback);
        void VolDwn_FB(VolumeBoolInputSigDelegate callback);
        void VolMute_FB(VolumeBoolInputSigDelegate callback);
        void VolLevel_FB(VolumeUShortInputSigDelegate callback);
        void VolPercentRX(VolumeStringInputSigDelegate callback);

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
                public const uint VolUp_btn = 1;
                public const uint VolDwn_btn = 2;
                public const uint VolMute_btn = 3;

                public const uint VolUp_FB = 1;
                public const uint VolDwn_FB = 2;
                public const uint VolMute_FB = 3;
            }
            internal static class Numerics
            {
                public const uint VolLevel_Set = 1;

                public const uint VolLevel_FB = 1;
            }
            internal static class Strings
            {
                public const uint VolPercentTX = 1;

                public const uint VolPercentRX = 1;
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
 
            ComponentMediator.ConfigureBooleanEvent(controlJoinId, Joins.Booleans.VolUp_btn, onVolUp_btn);
            ComponentMediator.ConfigureBooleanEvent(controlJoinId, Joins.Booleans.VolDwn_btn, onVolDwn_btn);
            ComponentMediator.ConfigureBooleanEvent(controlJoinId, Joins.Booleans.VolMute_btn, onVolMute_btn);
            ComponentMediator.ConfigureNumericEvent(controlJoinId, Joins.Numerics.VolLevel_Set, onVolLevel_Set);
            ComponentMediator.ConfigureStringEvent(controlJoinId, Joins.Strings.VolPercentTX, onVolPercentTX);

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

        public event EventHandler<UIEventArgs> VolUp_btn;
        private void onVolUp_btn(SmartObjectEventArgs eventArgs)
        {
            EventHandler<UIEventArgs> handler = VolUp_btn;
            if (handler != null)
                handler(this, UIEventArgs.CreateEventArgs(eventArgs));
        }

        public event EventHandler<UIEventArgs> VolDwn_btn;
        private void onVolDwn_btn(SmartObjectEventArgs eventArgs)
        {
            EventHandler<UIEventArgs> handler = VolDwn_btn;
            if (handler != null)
                handler(this, UIEventArgs.CreateEventArgs(eventArgs));
        }

        public event EventHandler<UIEventArgs> VolMute_btn;
        private void onVolMute_btn(SmartObjectEventArgs eventArgs)
        {
            EventHandler<UIEventArgs> handler = VolMute_btn;
            if (handler != null)
                handler(this, UIEventArgs.CreateEventArgs(eventArgs));
        }


        public void VolUp_FB(VolumeBoolInputSigDelegate callback)
        {
            for (int index = 0; index < Devices.Count; index++)
            {
                callback(Devices[index].SmartObjects[ControlJoinId].BooleanInput[Joins.Booleans.VolUp_FB], this);
            }
        }

        public void VolDwn_FB(VolumeBoolInputSigDelegate callback)
        {
            for (int index = 0; index < Devices.Count; index++)
            {
                callback(Devices[index].SmartObjects[ControlJoinId].BooleanInput[Joins.Booleans.VolDwn_FB], this);
            }
        }

        public void VolMute_FB(VolumeBoolInputSigDelegate callback)
        {
            for (int index = 0; index < Devices.Count; index++)
            {
                callback(Devices[index].SmartObjects[ControlJoinId].BooleanInput[Joins.Booleans.VolMute_FB], this);
            }
        }

        public event EventHandler<UIEventArgs> VolLevel_Set;
        private void onVolLevel_Set(SmartObjectEventArgs eventArgs)
        {
            EventHandler<UIEventArgs> handler = VolLevel_Set;
            if (handler != null)
                handler(this, UIEventArgs.CreateEventArgs(eventArgs));
        }


        public void VolLevel_FB(VolumeUShortInputSigDelegate callback)
        {
            for (int index = 0; index < Devices.Count; index++)
            {
                callback(Devices[index].SmartObjects[ControlJoinId].UShortInput[Joins.Numerics.VolLevel_FB], this);
            }
        }

        public event EventHandler<UIEventArgs> VolPercentTX;
        private void onVolPercentTX(SmartObjectEventArgs eventArgs)
        {
            EventHandler<UIEventArgs> handler = VolPercentTX;
            if (handler != null)
                handler(this, UIEventArgs.CreateEventArgs(eventArgs));
        }


        public void VolPercentRX(VolumeStringInputSigDelegate callback)
        {
            for (int index = 0; index < Devices.Count; index++)
            {
                callback(Devices[index].SmartObjects[ControlJoinId].StringInput[Joins.Strings.VolPercentRX], this);
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

            VolUp_btn = null;
            VolDwn_btn = null;
            VolMute_btn = null;
            VolLevel_Set = null;
            VolPercentTX = null;
        }

        #endregion

    }
}
